import React, { useEffect, useRef, useState } from "react";
import "./Wavy.css";
import { useMousePosition } from "../../hooks/useMousePosition";
import WaveSVG from "../../assets/wave.svg";

// helper function to update wave parameters
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

function updatePhase(waveConfig) {
  const random = Math.random();
  waveConfig.current.phase += random < 0.01 ? -0.000012 : 0.0000125;
}

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
  
  const numPoints = 5000;
  const stepSize = canvas.width / numPoints;

  function normalize(x, fromMin, fromMax) {
    return ((x - fromMin) / (fromMax - fromMin)) * 2 - 1;
  }

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
        const tremoloFreq = 0.003;
        totalAM += 0.5 * Math.sin(2 * Math.PI * tremoloFreq * x);
      }
      
      if (am2Active) {
        const ringFreq = (mousePos.x / canvas.width) * 0.015 + 0.005;
        totalAM += 0.67 * Math.sin(2 * Math.PI * ringFreq * x) * Math.sin(2 * Math.PI * carrierFreq * x);
      }
      
      if (am3Active) {
        const mouseAMFreq = (mousePos.y / canvas.height) * 0.02 + 0.008;
        totalAM += 0.8 * Math.sin(2 * Math.PI * mouseAMFreq * x);
      }
    }
    
    if (systemActive && fmActive) {
      if (fm1Active) {
        const modFreq = 0.001;
        const modIndex = 2;
        totalFM += (1 * modIndex) * Math.sin(2 * Math.PI * modFreq * x);
      }
      
      if (fm2Active) {
        const modFreq = (mousePos.x / canvas.width) * 0.01 + 0.002;
        const modIndex = 3;
        totalFM += modIndex * Math.sin(2 * Math.PI * modFreq * x);
      }
      
      if (fm3Active) {
        const modFreq = 0.006;
        const modIndex = 1.5;
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
  ctx.strokeStyle = "rgba(0, 0, 0, 0.67)";
  ctx.stroke();
}

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
    ampMax: 40,
    ampMin: 0,
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
          <button
            className={`modButton mainModButton ${systemActive ? 'active' : 'inactive'}`}
            onClick={() => setSystemActive(!systemActive)}
          >
            WaveMod
          </button>

          <button
            className={`modButton amMainButton ${amActive ? 'active' : 'inactive'}`}
            onClick={() => setAmActive(!amActive)}
            disabled={!systemActive}
          >
            AM
          </button>

          <button
            className={`modButton fmMainButton ${fmActive ? 'active' : 'inactive'}`}
            onClick={() => setFmActive(!fmActive)}
            disabled={!systemActive}
          >
            FM
          </button>

          <button
            className={`modButton ${am1Active ? 'active' : 'inactive'}`}
            onClick={() => setAm1Active(!am1Active)}
            disabled={!amActive}
          >
            AM1
          </button>

          <button
            className={`modButton ${fm1Active ? 'active' : 'inactive'}`}
            onClick={() => setFm1Active(!fm1Active)}
            disabled={!fmActive}
          >
            FM1
          </button>

          <button
            className={`modButton ${am2Active ? 'active' : 'inactive'}`}
            onClick={() => setAm2Active(!am2Active)}
            disabled={!amActive}
          >
            AM2
          </button>

          <button
            className={`modButton ${fm2Active ? 'active' : 'inactive'}`}
            onClick={() => setFm2Active(!fm2Active)}
            disabled={!fmActive}
          >
            FM2
          </button>

          <button
            className={`modButton ${am3Active ? 'active' : 'inactive'}`}
            onClick={() => setAm3Active(!am3Active)}
            disabled={!amActive}
          >
            AM3
          </button>

          <button
            className={`modButton ${fm3Active ? 'active' : 'inactive'}`}
            onClick={() => setFm3Active(!fm3Active)}
            disabled={!fmActive}
          >
            FM3
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wavy;