import React, { useState, useEffect, useRef } from "react";
import "./Wavy.css"

const Wavy = () => {
  const canvasRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0.0001);
  const [ampMod, setAmpMod] = useState(0);
  const [freqMod, setFreqMod] = useState(0);
  const [amplitude, setAmplitude] = useState(20);
  const [frequency, setFrequency] = useState(0.033);

  const frequencyChange = 0.1;
  const amplitudeChange = 0.3;

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
          (amplitude * ampMod) * Math.sin((x + phase) / 50);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "black";
      ctx.stroke();
    };

    const animationID = requestAnimationFrame(drawWave);
    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [phase, amplitude, ampMod]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      let maxAmpReached = false;
      let minAmpReached = false;
      let maxFreqReached = false;
      let minFreqReached = false;

      if (!maxFreqReached) {
        setFrequency((frequency) => {
          let newFrequency = frequency + frequencyChange;
          if (newFrequency >= 4) {
            newFrequency = 4;
            maxAmpReached = true;
          }
          return newFrequency;
        });
      } else if (!minFreqReached) {
        setFrequency((frequency) => {
          let newFrequency = frequency - frequencyChange;
          if (newFrequency <= 0.000001) {
            newFrequency = 0.000001;
            minFreqReached = true;
          }
          return newFrequency;
        });
      }

      if (!maxAmpReached) {
        setAmplitude((amplitude) => {
          let newAmplitude = amplitude + amplitudeChange;
          if (newAmplitude >= 20) {
            newAmplitude = 20;
            maxAmpReached = true;
          }
          return newAmplitude;
        });

      } else if (!minAmpReached) {
        setAmplitude((amplitude) => {
          let newAmplitude = amplitude - amplitudeChange;
          if (newAmplitude <= 0.01) {
            newAmplitude = 0.01;
            minAmpReached = true;
          }
          return newAmplitude;
        });
      }

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        setAmpMod((ampMod) => ampMod + (mousePos.y - canvas.height / 2) * 0.001);
        setFreqMod((freqMod) => freqMod + (mousePos.x - canvas.height / 2) * 0.001);
      }
      setPhase((phase) => phase + Math.random() < 0.01 ? phase - 0.01 : phase + 0.01);

    }, 5);

    return () => clearInterval(intervalId);
  }, [mousePos]);

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
      height={document.documentElement.clientHeight}
      onMouseMove={handleMouseMove}
    ></canvas>
  );
};

export default Wavy;
