import React, { useEffect, useRef, useState } from "react";
import "./Wavy.css";
import { useMousePosition } from "../../hooks/useMousePosition";
import WaveSVG from "../../assets/wave.svg";
import ModButton from "./ModButton";

// Normalizes a value from [fromMin, fromMax] to [-1, 1]
function normalize(x, fromMin, fromMax) {
  if (fromMax === fromMin) return 0;
  return ((x - fromMin) / (fromMax - fromMin)) * 2 - 1;
}

// Generic parameter updater used for amplitude/frequency oscillation
function updateParameter(value, maxReached, minReached, change, max, min) {
  if (!maxReached.current) {
    if (value >= max) {
      maxReached.current = true;
      minReached.current = false;
      return value;
    }
    return value + (change * Math.random());
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

// Updates wave amplitude/frequency using the oscillation helper
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

// Advances the carrier phase for slow drift
function updatePhase(waveConfig) {
  const random = Math.random();
  waveConfig.current.phase += random < 0.01 ? -0.000012 : 0.0000125;
}

// Main rendering loop: draws the carrier with AM/FM modulation
function drawWave(ctx, canvas, waveConfig, mousePos, modState) {
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(-4, canvas.height / 2);

  const numPoints = NUM_POINTS;
  const stepSize = canvas.width / numPoints;

  // Precompute normalized mouse-derived scalars once per frame
  const normMouseX = normalize(mousePos.x, 0, canvas.width);
  const mouseDiff = normalize(mousePos.x - mousePos.y, -canvas.width, canvas.width);
  const mouseSum = normalize(mousePos.x + mousePos.y, -canvas.width, canvas.width);
  const mouseProduct = normalize(mousePos.x * mousePos.y, -canvas.width, canvas.width);
  const mouseQuotient = normalize(mousePos.y !== 0 ? mousePos.x / mousePos.y : 0, 0, 10);

  for (let x = 0; x < canvas.width; x += stepSize) {
    const carrierFreq = frequency / 10;

    let totalAM = 0;
    let totalFM = 0;

    if (systemActive && amActive) {
      if (am1Active) {
        const tremoloFreq = TREMOLO_FREQ;
        totalAM += AM1_DEPTH * Math.sin(2 * Math.PI * tremoloFreq * x);
      }

      if (am2Active) {
        const ringFreq = (mousePos.x / canvas.width) * 0.015 + 0.005;
        totalAM += AM2_DEPTH * Math.sin(2 * Math.PI * ringFreq * x) * Math.sin(2 * Math.PI * carrierFreq * x);
      }

      if (am3Active) {
        const mouseAMFreq = (mousePos.y / canvas.height) * 0.02 + 0.008;
        const intensity = 0.6 + 0.4 * Math.abs(normMouseX);
        totalAM += intensity * Math.sin(2 * Math.PI * mouseAMFreq * x);
      }
    }

    if (systemActive && fmActive) {
      if (fm1Active) {
        const modFreq = FM1_BASE_FREQ;
        const modIndex = FM1_INDEX;
        totalFM += (1 * modIndex) * Math.sin(2 * Math.PI * modFreq * x);
      }

      if (fm2Active) {
        const modFreq = (mousePos.x / canvas.width) * 0.01 + 0.002;
        const modIndex = FM2_INDEX;
        totalFM += modIndex * Math.sin(2 * Math.PI * modFreq * x);
      }

      if (fm3Active) {
        const modFreq = FM3_BASE_FREQ / mouseQuotient;
        const modIndex = FM3_INDEX;
        const complexMod = Math.sin(2 * Math.PI * modFreq * x) +
                          0.5 * Math.sin(2 * Math.PI * modFreq * 2 * x);
        totalFM += modIndex * complexMod;
      }
    }

    const y = canvas.height / 2 +
      amplitude * (1 + totalAM) *
      Math.sin((x + phase) * (carrierFreq + totalFM));

    ctx.lineTo(x, y);
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = WAVE_COLOR;
  ctx.stroke();
}

// --- Constants -----------------------------------------------------------

const NUM_POINTS = 4000;
const WAVE_COLOR = "rgba(0, 0, 0, 0.67)";

// AM/FM modulation depths and base frequencies
const TREMOLO_FREQ = 0.003;
const AM1_DEPTH = 0.5;
const AM2_DEPTH = 0.67;
const AM3_DEPTH_BASE = 0.8; // used indirectly via intensity

const FM1_BASE_FREQ = 0.001;
const FM1_INDEX = 2;
const FM2_INDEX = 3;
const FM3_BASE_FREQ = 0.0006;
const FM3_INDEX = 1.5;

// --- Subcomponent --------------------------------------------------------

/**
 * ModulationControls: Renders the toggle icon and the 9-button grid.
 * All state and handlers are owned by the parent Wavy component.
 */
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
      >
        <img
          src={WaveSVG}
          alt="Wave Icon"
          className={`wave-icon ${menuExpanded ? 'expanded' : ''}`}
        />
      </button>

      <div className={`modulation-controls ${menuExpanded ? 'visible' : ''}`}>
        <ModButton
          label="MOD"
          active={systemActive}
          onClick={() => setSystemActive(!systemActive)}
          isMain
        />

        <ModButton
          label="AM"
          active={amActive}
          onClick={() => setAmActive(!amActive)}
          disabled={!systemActive}
        />

        <ModButton
          label="FM"
          active={fmActive}
          onClick={() => setFmActive(!fmActive)}
          disabled={!systemActive}
        />

        <ModButton
          label="AM1"
          active={am1Active}
          onClick={() => setAm1Active(!am1Active)}
          disabled={!amActive}
        />

        <ModButton
          label="FM1"
          active={fm1Active}
          onClick={() => setFm1Active(!fm1Active)}
          disabled={!fmActive}
        />

        <ModButton
          label="AM2"
          active={am2Active}
          onClick={() => setAm2Active(!am2Active)}
          disabled={!amActive}
        />

        <ModButton
          label="FM2"
          active={fm2Active}
          onClick={() => setFm2Active(!fm2Active)}
          disabled={!fmActive}
        />

        <ModButton
          label="AM3"
          active={am3Active}
          onClick={() => setAm3Active(!am3Active)}
          disabled={!amActive}
        />

        <ModButton
          label="FM3"
          active={fm3Active}
          onClick={() => setFm3Active(!fm3Active)}
          disabled={!fmActive}
        />
      </div>
    </div>
  );
}

// --- Component -----------------------------------------------------------

const Wavy = () => {
  const canvasRef = useRef();
  
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

  // wave constants
  const constants = { 
    amplitudeChange: 0.075,
    frequencyChange: 0.0002533333,
    ampMax: 55,
    ampMin: -5,
    freqMax: 1,
    freqMin: 0.01,
  };

  // UI state
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [systemActive, setSystemActive] = useState(false);
  const [amActive, setAmActive] = useState(false);
  const [fmActive, setFmActive] = useState(false);
  const [am1Active, setAm1Active] = useState(false);
  const [am2Active, setAm2Active] = useState(false);
  const [am3Active, setAm3Active] = useState(false);
  const [fm1Active, setFm1Active] = useState(false);
  const [fm2Active, setFm2Active] = useState(false);
  const [fm3Active, setFm3Active] = useState(false);

  const mousePos = useMousePosition(50);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const modState = {
      systemActive,
      amActive,
      fmActive,
      am1Active,
      am2Active,
      am3Active,
      fm1Active,
      fm2Active,
      fm3Active,
    };

    let frameId;
    const render = () => {
      updateWave(waveConfig, constants);
      updatePhase(waveConfig);
      drawWave(ctx, canvas, waveConfig, mousePos, modState);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [mousePos, systemActive, amActive, fmActive, am1Active, am2Active, am3Active, fm1Active, fm2Active, fm3Active]);

  // auto-disable sub-toggles when main toggle is turned off
  useEffect(() => {
    if (!amActive) {
      setAm1Active(false);
      setAm2Active(false);
      setAm3Active(false);
    }
  }, [amActive]);

  useEffect(() => {
    if (!fmActive) {
      setFm1Active(false);
      setFm2Active(false);
      setFm3Active(false);
    }
  }, [fmActive]);

  useEffect(() => {
    if (!systemActive) {
      setAmActive(false);
      setFmActive(false);
      setAm1Active(false);
      setAm2Active(false);
      setAm3Active(false);
      setFm1Active(false);
      setFm2Active(false);
      setFm3Active(false);
    }
  }, [systemActive]);

  return (
    <div className="wavy-container">
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 800}
        height={typeof window !== 'undefined' ? window.innerHeight / 2 : 400}
        className="wave-canvas"
      />

      <ModulationControls
        menuExpanded={menuExpanded}
        setMenuExpanded={setMenuExpanded}
        systemActive={systemActive}
        setSystemActive={setSystemActive}
        amActive={amActive}
        setAmActive={setAmActive}
        fmActive={fmActive}
        setFmActive={setFmActive}
        am1Active={am1Active}
        setAm1Active={setAm1Active}
        am2Active={am2Active}
        setAm2Active={setAm2Active}
        am3Active={am3Active}
        setAm3Active={setAm3Active}
        fm1Active={fm1Active}
        setFm1Active={setFm1Active}
        fm2Active={fm2Active}
        setFm2Active={setFm2Active}
        fm3Active={fm3Active}
        setFm3Active={setFm3Active}
      />
    </div>
  );
};

export default Wavy;