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

const CONSTANTS = WAVE_MOTION_CONSTANTS;

const WaveBackground = ({ mousePosition, modulationState, systemActive, samplesRef }) => {
  const canvasRef = useRef(null);
  const mousePosRef = useRef(mousePosition);
  const modStateRef = useRef(modulationState);
  const systemActiveRef = useRef(systemActive);
  const samplesRefRef = useRef(samplesRef);
  
  // Update refs when props change
  useEffect(() => {
    mousePosRef.current = mousePosition;
  }, [mousePosition]);
  
  useEffect(() => {
    modStateRef.current = modulationState;
  }, [modulationState]);
  
  useEffect(() => {
    systemActiveRef.current = systemActive;
  }, [systemActive]);
  
  useEffect(() => {
    samplesRefRef.current = samplesRef;
  }, [samplesRef]);
  
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
        ...modStateRef.current,
        systemActive: systemActiveRef.current,
      };

      updateWave(waveConfig, CONSTANTS);
      updatePhase(waveConfig);

      if (systemActiveRef.current && samplesRefRef.current) {
        sampleReadoutWave(canvas, waveConfig, mousePosRef.current, modState, samplesRefRef.current);
      }

      drawWave(ctx, canvas, waveConfig, mousePosRef.current, modState);

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

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
