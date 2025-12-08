import React, { useEffect, useRef } from "react";
import "../styles/WaveBackground.css";

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

// --- constants -----------------------------------------------------------

const NUM_POINTS = 3000;
const WAVE_COLOR = "rgba(0, 0, 0, 0.67)";
const CARRIER_FREQ_DIVISOR = 10;
const MOUSE_QUOTIENT_MAX = 10;

// AM/FM modulation depths and base frequencies
const TREMOLO_FREQ = 0.003;
const AM1_DEPTH = 0.5;
const AM2_DEPTH = 0.67;

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
const FM2_MOUSE_FREQ_SCALE = 0.001;
const FM2_MOUSE_FREQ_BASE = 0.002;
const FM3_SECOND_HARMONIC_WEIGHT = 0.5;

const READOUT_SAMPLES = 128;

const CONSTANTS = {
  amplitudeChange: 0.075,
  frequencyChange: 0.00008046,
  ampMax: 80.46,
  ampMin: -80.46,
  freqMax: 0.8046,
  freqMin: 0.008046,
};

// computes a single y-value for the current wave configuration at a given x
function computeWaveY(x, canvas, waveConfig, mousePos, modState) {
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

  const numPoints = NUM_POINTS;
  const stepSize = canvas.width / numPoints;

  // precompute normalized mouse-derived scalars (once per frame)
  const normMouseX = normalize(mousePos.x, 0, canvas.width);
  const mouseDiff = normalize(
    mousePos.x - mousePos.y,
    -canvas.width,
    canvas.width
  );
  const mouseSum = normalize(
    mousePos.x + mousePos.y,
    -canvas.width,
    canvas.width
  );
  const mouseProduct = normalize(
    mousePos.x * mousePos.y,
    -canvas.width,
    canvas.width
  );
  const mouseQuotient = normalize(
    mousePos.y !== 0 ? mousePos.x / mousePos.y : 0,
    0,
    MOUSE_QUOTIENT_MAX
  );

  const carrierFreq = frequency / CARRIER_FREQ_DIVISOR;

  let totalAM = 0;
  let totalFM = 0;

  if (systemActive && amActive) {
    if (am1Active) {
      const tremoloFreq = TREMOLO_FREQ;
      totalAM += AM1_DEPTH * Math.sin(2 * Math.PI * tremoloFreq * x);
    }

    if (am2Active) {
      const ringFreq =
        (mousePos.x / canvas.width) * AM2_MOUSE_FREQ_SCALE + AM2_MOUSE_FREQ_BASE;
      totalAM +=
        AM2_DEPTH *
        Math.sin(2 * Math.PI * ringFreq * x) *
        Math.sin(2 * Math.PI * carrierFreq * x);
    }

    if (am3Active) {
      const mouseAMFreq =
        (mousePos.y / canvas.height) * AM3_MOUSE_FREQ_SCALE + AM3_MOUSE_FREQ_BASE;
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
      const modFreq =
        (mousePos.x / canvas.width) * FM2_MOUSE_FREQ_SCALE + FM2_MOUSE_FREQ_BASE;
      const modIndex = FM2_INDEX;
      totalFM += modIndex * Math.sin(2 * Math.PI * modFreq * x);
    }

    if (fm3Active) {
      const modFreq = FM3_BASE_FREQ / mouseQuotient;
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

  const numPoints = NUM_POINTS;
  const stepSize = canvas.width / numPoints;

  for (let x = 0; x < canvas.width; x += stepSize) {
    const y = computeWaveY(x, canvas, waveConfig, mousePos, modState);
    ctx.lineTo(x, y);
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

// samples a reduced set of main-canvas points for metrics/readout
function sampleReadoutWave(canvas, waveConfig, mousePos, modState, samplesRef) {
  const width = canvas.width;
  const height = canvas.height;
  const count = READOUT_SAMPLES;

  if (!canvas || count <= 1) {
    samplesRef.current = [];
    return;
  }

  if (!samplesRef.current || samplesRef.current.length !== count) {
    samplesRef.current = new Array(count);
  }

  const stepX = width / (count - 1);
  const mid = height / 2;

  for (let i = 0; i < count; i++) {
    const x = i * stepX;
    const y = computeWaveY(x, canvas, waveConfig, mousePos, modState);
    samplesRef.current[i] = { x, y: y - mid };
  }
}

const WaveBackground = ({ mousePosition, modulationState, systemActive, samplesRef }) => {
  const canvasRef = useRef(null);
  const waveConfig = useRef({
    amplitude: 10,
    frequency: 0.0101,
    phase: 0.000000001,
    ampMaxReached: { current: false },
    ampMinReached: { current: false },
    freqMaxReached: { current: false },
    freqMinReached: { current: false },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let frameId;

    const render = () => {
      const modState = {
        ...modulationState,
        systemActive,
      };

      updateWave(waveConfig, CONSTANTS);
      updatePhase(waveConfig);

      if (systemActive && samplesRef) {
        sampleReadoutWave(canvas, waveConfig, mousePosition, modState, samplesRef);
      }

      drawWave(ctx, canvas, waveConfig, mousePosition, modState);

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mousePosition, modulationState, systemActive, samplesRef]);

  return (
    <div className="wave-background">
      <canvas
        ref={canvasRef}
        className="wave-canvas"
        role="img"
        aria-label="Animated wave visualization"
      />
    </div>
  );
};

export default WaveBackground;
