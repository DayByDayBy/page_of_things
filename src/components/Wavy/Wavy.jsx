import React, { useEffect, useRef, useState, useReducer } from "react";
import "./Wavy.css";
import { useMousePosition } from "../../hooks/useMousePosition";
import OscilloscopeDisplay from "./OscilloscopeDisplay";
import WaveBackground from "./WaveBackground";
import WaveControls from "./WaveControls";
import { initialModulationState, modulationReducer } from "../../state/modulationReducer";

// normalizes a value from [fromMin, fromMax] to [-1, 1]
function normalize(x, fromMin, fromMax) {
  if (fromMax === fromMin) return 0;
  return ((x - fromMin) / (fromMax - fromMin)) * 2 - 1;
}

// generic parameter updater used for amplitude/frequency oscillation
function updateParameter(value, maxReached, minReached, change, max, min) {
  if (!maxReached.current) {
    if (value >= max) {
      maxReached.current = true;
      minReached.current = false;
      return value;
    }
    return value + change * Math.random();
  } else if (!minReached.current) {
    if (value <= min) {
      minReached.current = true;
      maxReached.current = false;
      return value;
    }
    return value - change;
  }
  return value;
}

// updates wave amplitude/frequency using oscillation helper
function updateWave(waveConfig, constants) {
  waveConfig.current.amplitude = updateParameter(
    waveConfig.current.amplitude,
    waveConfig.current.ampMaxReached,
    waveConfig.current.ampMinReached,
    constants.amplitudeChange,
    constants.ampMax,
    constants.ampMin
  );

  waveConfig.current.frequency = updateParameter(
    waveConfig.current.frequency,
    waveConfig.current.freqMaxReached,
    waveConfig.current.freqMinReached,
    constants.frequencyChange,
    constants.freqMax,
    constants.freqMin
  );
}

// advances carrier phase for slow drift
function updatePhase(waveConfig) {
  const random = Math.random();
  waveConfig.current.phase += random < 0.01 ? -0.000012 : 0.0000125;
}

// main rendering helpers ------------------------------------------------------

// compute mouse-derived scalars once per frame
function computeMouseScalars(canvas, mousePos) {
  const MAX_QUOTIENT = Math.max(canvas.width, 1000);
  
  const normMouseX = normalize(mousePos.x, 0, canvas.width);
  const mouseDiff = normalize(
    mousePos.x - mousePos.y,
    -canvas.height,
    canvas.width
  );
  const mouseSum = normalize(
    mousePos.x + mousePos.y,
    0,
    canvas.width + canvas.height
  );
  const mouseProduct = normalize(
    mousePos.x * mousePos.y,
    0,
    canvas.width * canvas.height
  );
  const rawQuotient = mousePos.y !== 0 ? mousePos.x / mousePos.y : canvas.width;
  const boundedQuotient = Math.min(Math.abs(rawQuotient), MAX_QUOTIENT);
  const normalizedQuotient = normalize(boundedQuotient, 0, MAX_QUOTIENT);
  const mouseQuotient = Math.max(-1, Math.min(1, normalizedQuotient));
  
  return { normMouseX, mouseDiff, mouseSum, mouseProduct, mouseQuotient };
}

// computes a single y-value for the current wave configuration at a given x
function computeWaveY(x, canvas, waveConfig, mouseScalars, modState) {
  const { amplitude, frequency, phase } = waveConfig.current;
  const {
    systemActive,
    amActive,
    fmActive,
    am1Active,
    am2Active,
    am3Active,
    fm1Active,
    fm2Active,
    fm3Active,
  } = modState;

  const { normMouseX, mouseDiff, mouseSum, mouseQuotient } = mouseScalars;

  const carrierFreq = frequency / CARRIER_FREQ_DIVISOR;

  let totalAM = 0;
  let totalFM = 0;

  if (systemActive && amActive) {
    if (am1Active) {
      const tremoloFreq = TREMOLO_FREQ;
      totalAM += AM1_DEPTH * Math.sin(2 * Math.PI * tremoloFreq * x);
    }

    if (am2Active) {
      const ringFreq = mouseSum * AM2_MOUSE_FREQ_SCALE + AM2_MOUSE_FREQ_BASE;
      totalAM +=
        AM2_DEPTH *
        Math.sin(2 * Math.PI * ringFreq * x) *
        Math.sin(2 * Math.PI * carrierFreq * x);
    }

    if (am3Active) {
      const mouseAMFreq = mouseDiff * AM3_MOUSE_FREQ_SCALE + AM3_MOUSE_FREQ_BASE;
      const intensity =
        AM3_INTENSITY_BASE + AM3_INTENSITY_VARIATION * Math.abs(normMouseX);
      totalAM += intensity * Math.sin(2 * Math.PI * mouseAMFreq * x);
    }
  }

  if (systemActive && fmActive) {
    if (fm1Active) {
      const modFreq = FM1_BASE_FREQ;
      const modIndex = FM1_INDEX;
      totalFM += modIndex * Math.sin(2 * Math.PI * modFreq * x);
    }

    if (fm2Active) {
      const modFreq = normMouseX * FM2_MOUSE_FREQ_SCALE + FM2_MOUSE_FREQ_BASE;
      const modIndex = FM2_INDEX;
      totalFM += modIndex * Math.sin(2 * Math.PI * modFreq * x);
    }

    if (fm3Active) {
      const safeQuotient = Math.abs(mouseQuotient) < 1e-3
        ? (Math.sign(mouseQuotient) || 1) * 1e-3
        : mouseQuotient;
      const modFreq = FM3_BASE_FREQ / safeQuotient;
      const modIndex = FM3_INDEX;
      const complexMod =
        Math.sin(2 * Math.PI * modFreq * x) +
        FM3_SECOND_HARMONIC_WEIGHT *
          Math.sin(2 * Math.PI * modFreq * 2 * x);
      totalFM += modIndex * complexMod;
    }
  }

  return (
    canvas.height / 2 +
    amplitude * (1 + totalAM) *
    Math.sin((x + phase) * (carrierFreq + totalFM))
  );
}

// main rendering loop: draws the carrier (with any active AM/FM modulation)
function drawWave(ctx, canvas, waveConfig, mousePos, modState, strokeStyle = WAVE_COLOR) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(-4, canvas.height / 2);

  const mouseScalars = computeMouseScalars(canvas, mousePos);
  const numPoints = NUM_POINTS;
  const stepSize = canvas.width / numPoints;

  for (let x = 0; x < canvas.width; x += stepSize) {
    const y = computeWaveY(x, canvas, waveConfig, mouseScalars, modState);
    ctx.lineTo(x, y);
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

// samples OSC_SAMPLES points into the oscilloscope buffer and returns min/max
function sampleOscilloscope(oscCanvas, waveConfig, mousePos, modState, buffer) {
  const width = oscCanvas.width;
  const height = oscCanvas.height;
  const count = buffer.length;

  if (!count) {
    return { min: height / 2, max: height / 2 };
  }

  const mouseScalars = computeMouseScalars(oscCanvas, mousePos);
  const stepX = count > 1 ? width / (count - 1) : 0;

  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = i * stepX;
    const y = computeWaveY(x, oscCanvas, waveConfig, mouseScalars, modState);
    buffer[i] = y;
    if (y < min) min = y;
    if (y > max) max = y;
  }

  if (!isFinite(min) || !isFinite(max)) {
    const mid = height / 2;
    return { min: mid, max: mid };
  }

  return { min, max };
}

// draws the oscilloscope buffer into the small canvas, normalized to always fit
function drawOscilloscopeFromBuffer(oscCtx, oscCanvas, buffer, min, max) {
  const width = oscCanvas.width;
  const height = oscCanvas.height;
  const count = buffer.length;

  oscCtx.clearRect(0, 0, width, height);
  if (!count) return;

  const padding = 4;
  const usableHeight = Math.max(1, height - 3 * padding);
  const mid = (min + max) / 2;
  const range = max - min;
  const halfRange = range / 2 || 1; // avoid divide by zero

  const stepX = count > 1 ? width / (count - 1) : 0;

  oscCtx.beginPath();

  for (let i = 0; i < count; i++) {
    const x = i * stepX;
    const yRaw = buffer[i];
    const norm = (yRaw - mid) / halfRange; // -1..1
    const y = height / 2 - norm * (usableHeight / 2);

    if (i === 0) {
      oscCtx.moveTo(x, y);
    } else {
      oscCtx.lineTo(x, y);
    }
  }

  oscCtx.lineWidth = 1;
  oscCtx.strokeStyle = OSCILLOSCOPE_WAVE_COLOR;
  oscCtx.stroke();
}

// samples a reduced set of main-canvas points for metrics/readout
function sampleReadoutWave(canvas, waveConfig, mousePos, modState, samplesRef) {
  if (!canvas) {
    samplesRef.current = [];
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  const count = READOUT_SAMPLES;

  if (count <= 1) {
    samplesRef.current = [];
    return;
  }

  if (!samplesRef.current || samplesRef.current.length !== count) {
    samplesRef.current = new Array(count);
  }

  const mouseScalars = computeMouseScalars(canvas, mousePos);
  const stepX = width / (count - 1);
  const mid = height / 2;

  for (let i = 0; i < count; i++) {
    const x = i * stepX;
    const y = computeWaveY(x, canvas, waveConfig, mouseScalars, modState);
    samplesRef.current[i] = { x, y: y - mid };
  }
}

// --- constants (collected here to aid refactoring, etc)-----------------------------------------------------------

const NUM_POINTS = 3000;
const WAVE_COLOR = "rgba(0, 0, 0, 0.67)";
const OSCILLOSCOPE_WAVE_COLOR = "rgba(160, 196, 224, 0.8)";
const OSC_SAMPLES = 64;
const READOUT_SAMPLES = 128;

// AM/FM modulation depths and base frequencies
const TREMOLO_FREQ = 0.003;
const AM1_DEPTH = 0.5;
const AM2_DEPTH = 0.67;
const AM3_DEPTH_BASE = 0.8; // not yet used, do plan to tho 

const CARRIER_FREQ_DIVISOR = 10;
const MOUSE_QUOTIENT_MAX = 10;

const AM2_MOUSE_FREQ_SCALE = 0.015;
const AM2_MOUSE_FREQ_BASE = 0.005;

const AM3_MOUSE_FREQ_SCALE = 0.02;
const AM3_MOUSE_FREQ_BASE = 0.008;
const AM3_INTENSITY_BASE = 0.6;
const AM3_INTENSITY_VARIATION = 0.4;

const FM1_BASE_FREQ = 0.001;
const FM1_INDEX = 2;
const FM2_INDEX = 3;
const FM3_BASE_FREQ = 0.0006;
const FM3_INDEX = 1.5;
const FM2_MOUSE_FREQ_SCALE = 0.01;
const FM2_MOUSE_FREQ_BASE = 0.002;
const FM3_SECOND_HARMONIC_WEIGHT = 0.5;

// animation constants (bounds, change rates - stops wave going too wild)
const ANIMATION_CONSTANTS = {
  amplitudeChange: 0.075,
  frequencyChange: 0.0002533333,
  ampMax: 40,
  ampMin: -20,
  freqMax: 1,
  freqMin: 0.01,
};

// modulationReducer: manages 9 boolean toggles.
// actions are named to mirror old setter names.
// behavior: toggles preserve sub-toggle states (hardware-like memory)

// --- Component -----------------------------------------------------------

const Wavy = () => {
  const canvasRef = useRef();
  const oscilloscopeRef = useRef();
  const oscBufferRef = useRef(new Array(OSC_SAMPLES).fill(0));
  const readoutSamplesRef = useRef([]);

  // consolidated wave configuration
  const waveConfig = useRef({
    amplitude: 10,
    frequency: 0.0101,
    phase: 0.000000001,
    ampMaxReached: { current: false },
    ampMinReached: { current: false },
    freqMaxReached: { current: false },
    freqMinReached: { current: false },
  });


  // UI state: modulation toggles via useReducer
  const [modState, dispatch] = useReducer(modulationReducer, initialModulationState);

  const {
    systemActive,
    amActive,
    fmActive,
    am1Active,
    am2Active,
    am3Active,
    fm1Active,
    fm2Active,
    fm3Active,
  } = modState;

  const mousePos = useMousePosition(50);

  useEffect(() => {
    const canvas = canvasRef.current;
    const oscCanvas = oscilloscopeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const oscCtx = oscCanvas ? oscCanvas.getContext("2d") : null;

    let frameId;
    const render = () => {
      updateWave(waveConfig, ANIMATION_CONSTANTS);
      updatePhase(waveConfig);
      if (systemActive) {
        sampleReadoutWave(canvas, waveConfig, mousePos, modState, readoutSamplesRef);
      }
      drawWave(ctx, canvas, waveConfig, mousePos, modState);
      if (oscCtx && oscCanvas && systemActive) {
        const { min, max } = sampleOscilloscope(
          oscCanvas,
          waveConfig,
          mousePos,
          modState,
          oscBufferRef.current
        );
        drawOscilloscopeFromBuffer(
          oscCtx,
          oscCanvas,
          oscBufferRef.current,
          min,
          max
        );
      }
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [mousePos, modState, systemActive]);

  return (
    <div className="wavy-container">
      <WaveControls
        modState={modState}
        dispatch={dispatch}
        oscilloscopeRef={oscilloscopeRef}
        readoutSamplesRef={readoutSamplesRef}
      />

      <WaveBackground
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={
          typeof window !== "undefined" ? Math.floor(window.innerHeight / 2) : 400
        }
      />
    </div>
  );
};

export default Wavy;