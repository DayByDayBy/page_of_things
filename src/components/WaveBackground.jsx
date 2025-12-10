import React, { useEffect, useRef } from "react";
import "../styles/Wave.css";
import {
  NUM_POINTS,
  WAVE_COLOR,
  CARRIER_FREQ_DIVISOR,
  MOUSE_QUOTIENT_MAX,
  TREMOLO_FREQ,
  AM1_DEPTH,
  AM2_DEPTH,
  AM2_MOUSE_FREQ_SCALE,
  AM2_MOUSE_FREQ_BASE,
  AM3_MOUSE_FREQ_SCALE,
  AM3_MOUSE_FREQ_BASE,
  AM3_INTENSITY_BASE,
  AM3_INTENSITY_VARIATION,
  FM1_BASE_FREQ,
  FM1_INDEX,
  FM2_INDEX,
  FM3_BASE_FREQ,
  FM3_INDEX,
  FM2_MOUSE_FREQ_SCALE,
  FM2_MOUSE_FREQ_BASE,
  FM3_SECOND_HARMONIC_WEIGHT,
  READOUT_SAMPLES,
  WAVE_MOTION_CONSTANTS,
} from "../constants/waveConstants";
import {
  normalize,
  updateParameter,
  updateWave,
  updatePhase,
  computeWaveY,
  drawWave,
  sampleReadoutWave,
} from "../utils/waveComputation";

// normalizes a value from [fromMin, fromMax] to [-1, 1]

// generic parameter updater used for amplitude/frequency oscillation

// updates wave amplitude/frequency using oscillation helper

// advances carrier phase for slow drift

// --- constants -----------------------------------------------------------

const CONSTANTS = WAVE_MOTION_CONSTANTS;

// computes a single y-value for the current wave configuration at a given x

// main rendering loop: draws the carrier (with any active AM/FM modulation)

// samples a reduced set of main-canvas points for metrics/readout

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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
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
