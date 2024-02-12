import React, { useState, useEffect, useRef } from "react";
import "./Wavy.css"

const Wavy = () => {
  const canvasRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0.0001);
  var amplitude = 50;
  var frequency = 0.033;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(-10, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        const y =
          canvas.height / 2 + amplitude * Math.sin((x + mousePos.x) / 50);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "black";
      ctx.stroke();
    };
    drawWave();

  }, [mousePos, amplitude]);

  useEffect(() => {
    let maxAmpReached = false;
    let minAmpReached = false;
    let maxFreqReached = false;
    let minFreqReached = false;

    const updateFrequency = () => {
      const frequencyChange = 3;

      if (!maxFreqReached) {
        frequency += frequencyChange;
        if (frequency >= 4) {
          frequency = 4;
          maxAmpReached = true;
        }
      } else if (!minFreqReached) {
        frequency -= frequencyChange;
        if (frequency <= 0.000001);
        frequency = 0.000001;
        minFreqReached = true;
      } else {
        maxFreqReached = false;
        minFreqReached = false;
      }
    };
    const updateAmplitude = () => {
      const amplitudeChange = 3;
      if (!maxAmpReached) {
        amplitude += amplitudeChange;
        if (amplitude >= 60) {
          amplitude = 60;
          maxAmpReached = true;
        }
      } else if (!minAmpReached) {
        amplitude -= amplitudeChange;
        if (amplitude <= 0.01);
        amplitude = 0.01;
        minAmpReached = true;
      } else {
        maxAmpReached = false;
        minAmpReached = false;
      }
    };

    const amplitudeModulation = (mousePos) => {
      amplitude -= mousePos.y * 0.1;
    };
    const frequencyModulation = (mousePos) => {
      frequency += mousePos.x * 0.1;
    };
    const intervalId = setInterval(() => {
      updateAmplitude();
      updateFrequency();
      amplitudeModulation(mousePos);
      frequencyModulation(mousePos);
      // Math.random() < 0.01 ? (phase += 0.01) : (phase -= 0.01);
    }, 5);

    return () => clearInterval(intervalId);

  });
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPhase(phase => phase + (Math.random() < 0.01 ? 0.01 : -0.01));
      }, 5);

      return () => clearInterval(intervalId);
    }, []);





  const handleMouseMove = (event) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.outerWidth}
      height={window.innerHeight}
      onMouseMove={handleMouseMove}
    ></canvas>
  );
};

export default Wavy;
