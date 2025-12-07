import React, { useEffect, useRef, useState, useReducer } from "react";
import "./Wavy.css";
import { useMousePosition } from "../../hooks/useMousePosition";
import WaveSVG from "../../assets/wave.svg";
import ModButton from "./ModButton";
import OscilloscopeDisplay from "./OscilloscopeDisplay";

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

// samples OSC_SAMPLES points into the oscilloscope buffer and returns min/max
function sampleOscilloscope(oscCanvas, waveConfig, mousePos, modState, buffer) {
  const width = oscCanvas.width;
  const height = oscCanvas.height;
  const count = buffer.length;

  if (!count) {
    return { min: height / 2, max: height / 2 };
  }

  const stepX = count > 1 ? width / (count - 1) : 0;

  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = i * stepX;
    const y = computeWaveY(x, oscCanvas, waveConfig, mousePos, modState);
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

// --- constants (collected here to aid refactoring, etc)-----------------------------------------------------------

const NUM_POINTS = 4000;
const WAVE_COLOR = "rgba(0, 0, 0, 0.67)";
const OSCILLOSCOPE_WAVE_COLOR = "rgba(160, 196, 224, 0.8)";
const OSC_SAMPLES = 128;

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

// --- Subcomponent --------------------------------------------------------

// `ModulationControls`: renders  toggle icon and 9-button grid.
// all state and handlers are owned by parent `Wavy component.
function ModulationControls({
  menuExpanded,
  setMenuExpanded,
  systemActive,
  setSystemActive,
  amActive,
  setAmActive,
  fmActive,
  setFmActive,
  am1Active,
  setAm1Active,
  am2Active,
  setAm2Active,
  am3Active,
  setAm3Active,
  fm1Active,
  setFm1Active,
  fm2Active,
  setFm2Active,
  fm3Active,
  setFm3Active,
}) {
  return (
    <div className="modulation-controls-container">
      <button
        className="toggle-modulation-menu"
        onClick={() => setMenuExpanded(!menuExpanded)}
        aria-expanded={menuExpanded}
        aria-controls="modulation-controls"
        aria-label={menuExpanded ? "Hide modulation controls" : "Show modulation controls"}
      >
        <img
          src={WaveSVG}
          alt="Wave Icon"
          className={`wave-icon ${menuExpanded ? "expanded" : ""}`}
        />
      </button>

      <div
        id="modulation-controls"
        className={`modulation-controls ${menuExpanded ? "visible" : ""}`}
        role="group"
        aria-label="Wave modulation controls"
      >
        <ModButton
          label="⏻"
          active={systemActive}
          onClick={() => setSystemActive(!systemActive)}
          isMain
        />

        <ModButton
          label="AM"
          active={amActive}
          onClick={() => setAmActive(!amActive)}
          description="amplitude modulation toggle"
          disabled={!systemActive}
        />

        <ModButton
          label="FM"
          active={fmActive}
          onClick={() => setFmActive(!fmActive)}
          description="frequency modulation toggle"
          disabled={!systemActive}
        />

        <ModButton
          label="AM1"
          active={am1Active}
          onClick={() => setAm1Active(!am1Active)}
          description="AM one"
          disabled={!amActive}
        />

        <ModButton
          label="FM1"
          active={fm1Active}
          onClick={() => setFm1Active(!fm1Active)}
          description="FM one"
          disabled={!fmActive}
        />

        <ModButton
          label="AM2"
          active={am2Active}
          onClick={() => setAm2Active(!am2Active)}
          description="AM two"
          disabled={!amActive}
        />

        <ModButton
          label="FM2"
          active={fm2Active}
          onClick={() => setFm2Active(!fm2Active)}
          description="FM two"
          disabled={!fmActive}
        />

        <ModButton
          label="AM3"
          active={am3Active}
          onClick={() => setAm3Active(!am3Active)}
          description="AM three"
          disabled={!amActive}
        />

        <ModButton
          label="FM3"
          active={fm3Active}
          onClick={() => setFm3Active(!fm3Active)}
          description="FM three"
          disabled={!fmActive}
        />
      </div>
    </div>
  );
}

// modulationReducer: manages 9 boolean toggles.
// actions are named to mirror old setter names.
// invariant: turning off a main toggle disables all its sub-toggles
function modulationReducer(state, action) {
  switch (action.type) {
    case "setSystemActive": {
      if (!action.payload) {
        return {
          systemActive: false,
          amActive: false,
          fmActive: false,
          am1Active: false,
          am2Active: false,
          am3Active: false,
          fm1Active: false,
          fm2Active: false,
          fm3Active: false,
        };
      }
      return { ...state, systemActive: true };
    }
    case "setAmActive": {
      if (!action.payload) {
        return {
          ...state,
          amActive: false,
          am1Active: false,
          am2Active: false,
          am3Active: false,
        };
      }
      return { ...state, amActive: true };
    }
    case "setFmActive": {
      if (!action.payload) {
        return {
          ...state,
          fmActive: false,
          fm1Active: false,
          fm2Active: false,
          fm3Active: false,
        };
      }
      return { ...state, fmActive: true };
    }
    case "setAm1Active":
      return { ...state, am1Active: action.payload };
    case "setAm2Active":
      return { ...state, am2Active: action.payload };
    case "setAm3Active":
      return { ...state, am3Active: action.payload };
    case "setFm1Active":
      return { ...state, fm1Active: action.payload };
    case "setFm2Active":
      return { ...state, fm2Active: action.payload };
    case "setFm3Active":
      return { ...state, fm3Active: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// --- Component -----------------------------------------------------------

const Wavy = () => {
  const canvasRef = useRef();
  const oscilloscopeRef = useRef();
  const oscBufferRef = useRef(new Array(OSC_SAMPLES).fill(0));

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

  // animation constants (bounds, change rates - stops wave going too wild)
  const constants = {
    amplitudeChange: 0.075,
    frequencyChange: 0.0002533333,
    ampMax: 50,
    ampMin: -25,
    freqMax: 1,
    freqMin: 0.01,
  };

  // UI state: menu visibility
  const [menuExpanded, setMenuExpanded] = useState(false);

  // UI state: modulation toggles via useReducer
  const [modState, dispatch] = useReducer(modulationReducer, {
    systemActive: false,
    amActive: false,
    fmActive: false,
    am1Active: false,
    am2Active: false,
    am3Active: false,
    fm1Active: false,
    fm2Active: false,
    fm3Active: false,
  });

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
      updateWave(waveConfig, constants);
      updatePhase(waveConfig);
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
  }, [mousePos, modState, constants, systemActive]);

  return (
    <div className="wavy-container">
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={
          typeof window !== "undefined" ? Math.floor(window.innerHeight / 2) : 400
        }
        className="wave-canvas"
        role="img"
        aria-label="Animated wave visualization"
      />

      <ModulationControls
        menuExpanded={menuExpanded}
        setMenuExpanded={setMenuExpanded}
        systemActive={systemActive}
        setSystemActive={(v) => dispatch({ type: "setSystemActive", payload: v })}
        amActive={amActive}
        setAmActive={(v) => dispatch({ type: "setAmActive", payload: v })}
        fmActive={fmActive}
        setFmActive={(v) => dispatch({ type: "setFmActive", payload: v })}
        am1Active={am1Active}
        setAm1Active={(v) => dispatch({ type: "setAm1Active", payload: v })}
        am2Active={am2Active}
        setAm2Active={(v) => dispatch({ type: "setAm2Active", payload: v })}
        am3Active={am3Active}
        setAm3Active={(v) => dispatch({ type: "setAm3Active", payload: v })}
        fm1Active={fm1Active}
        setFm1Active={(v) => dispatch({ type: "setFm1Active", payload: v })}
        fm2Active={fm2Active}
        setFm2Active={(v) => dispatch({ type: "setFm2Active", payload: v })}
        fm3Active={fm3Active}
        setFm3Active={(v) => dispatch({ type: "setFm3Active", payload: v })}
      />
      {systemActive && <OscilloscopeDisplay ref={oscilloscopeRef} />}
    </div>
  );
};

export default Wavy;