import React, { useState, useEffect, useRef } from "react";
import "./Wavy.css"

const Wavy = () => {
  const canvasRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0.0001);
  const [amplitude, setAmplitude] = useState(20);
  const [frequency, setFrequency] = useState(20);


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
          (amplitude) * Math.sin((x + phase) / (50 * frequency));
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "hsla(0, 0%, 0%, 0.99)";
      ctx.stroke();
    };

    const animationID = requestAnimationFrame(drawWave);
    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [phase, amplitude, frequency]);

  useEffect(() => {
    const intervalId = setInterval(() => {

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
      setPhase((phase) => phase + Math.random() < 0.03 ? phase - 0.01 : phase + 0.01);
    }, 500);

    return () => clearInterval(intervalId);
  }, [ amplitude,frequency ]);


 

  const handleMouseMove = (event) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    setPhase(phase => phase + Math.random() < 0.01 ? phase - 0.01 : phase + 0.01);
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      width={document.documentElement.clientWidth}
      height={document.documentElement.clientHeight/2}
      onMouseMove={handleMouseMove}
    ></canvas>
  );
};

export default Wavy;
