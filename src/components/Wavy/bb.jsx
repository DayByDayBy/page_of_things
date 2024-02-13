


import React, { useState, useEffect, useRef } from "react";
import "./Wavy.css";

const Wavy = () => {
  const canvasRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [amplitude, setAmplitude] = useState(20);
  const [frequency, setFrequency] = useState(20);
  const [phase, setPhase] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const frequencyChange = 0.001;
  const amplitudeChange = 0.003;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(-1, canvas.height / 2);

      const numPoints = 5000;
      const stepSize = canvas.width / numPoints;

      for (let x = 0; x < canvas.width; x += stepSize) {
        const y =
          canvas.height / 2 +
          amplitude * Math.sin((x + phase) / (50 * frequency));
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "hsla(0, 0%, 0%, 0.99)";
      ctx.stroke();
    };

    if (!isDrawing) {
      const animationID = requestAnimationFrame(drawWave);
      return () => {
        cancelAnimationFrame(animationID);
      };
    }
  }, [amplitude, frequency, phase, isDrawing]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPhase((prevPhase) => prevPhase + 0.01); // Update phase for dynamic wave behavior
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const throttleMouseMove = throttle((event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    }, 100); // Adjust throttle duration as needed

    window.addEventListener("mousemove", throttleMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttleMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateWave = () => {
      if (amplitude < 20) {
        setAmplitude((amplitude) => Math.min(amplitude + amplitudeChange, 20));
      } else {
        setAmplitude((amplitude) => Math.max(amplitude - amplitudeChange, 0.01));
      }

      if (frequency < 10) {
        setFrequency((frequency) => Math.min(frequency + frequencyChange, 20));
      } else {
        setFrequency((frequency) => Math.max(frequency - frequencyChange, 0.0001));
      }
    };

    const animationID = requestAnimationFrame(updateWave);
    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [amplitude, frequency]);

  // Throttle function for mouse move events
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      const context = this;
      if (!lastRan) {
        func.call(context, ...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.call(context, ...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  return (
    <canvas
      ref={canvasRef}
      width={document.documentElement.clientWidth}
      height={document.documentElement.clientHeight / 2}
      onMouseEnter={() => setIsDrawing(true)}
      onMouseLeave={() => setIsDrawing(false)}
    ></canvas>
  );
};

export default Wavy;


















// Inside your drawWave function
const wave1 = (x) => Math.sin(x / 50); // Example waveforms
const wave2 = (x) => Math.sin(x / 30);
const wave3 = (x) => Math.sin(x / 20);

for (let x = 0; x < canvas.width; x++) {
  const y = canvas.height / 2 + (wave1(x) + wave2(x) + wave3(x)) * 20; // Sum of multiple waveforms
  ctx.lineTo(x, y);
}
