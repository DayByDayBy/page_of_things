import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Wavy.css"

const Wavy = () => {
  const canvasRef = useRef();

  const [phase, setPhase] = useState(0.00001);
  const [amplitude, setAmplitude] = useState(10);
  const [frequency, setFrequency] = useState(0.000001);

  const ampMaxReached = useRef(false);
  const ampMinReached = useRef(false);
  const freqMaxReached = useRef(false);
  const freqMinReached = useRef(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [onClick, setOnClick] = useState(false);

  const frequencyChange = 0.00003;
  const amplitudeChange = 0.067;
  const ampMax = 30;
  const ampMin = 0.01;
  const freqMax = 2;
  const freqMin = 0.000001;

  // basic wave stuff, if you're curious:
  // y = Math.sin(x) * (frequency modifier)
  // y = (amplitude modifier) + Math.sin(x)
  // the more complicated looking stuff is basically doing variations 
  // of that to change wave amplitude and frequency, and wavelength is 
  // just inversely related to frequency. 
  // canvas.height/2 places it in the middle of the defined canvas, nudged slighly 
  // to the side because canvas draws a weird line at the edge of waves


  const drawWave = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(-1, canvas.height / 2);
    const numPoints = 747;
    const stepSize = canvas.width / numPoints;
    for (let x = 0; x < canvas.width; x += (stepSize)) {
      const y = canvas.height / 2 + amplitude * Math.sin((x + phase) * frequency);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "hsla(0, 0%, 0%, 0.99)";
    ctx.stroke();
  };


  console.log("amp min reached: ", ampMinReached);
  console.log("amplitude : ", amplitude);

  const updateWave = useCallback(() => {
    if (!ampMaxReached.current) {
      if (amplitude >= ampMax) {
        ampMaxReached.current = true;
        ampMinReached.current = false;
      } else if (amplitude < ampMax) {
        setAmplitude((amplitude) => amplitude + amplitudeChange);
      }

    } else if (!ampMinReached.current) {
      if (amplitude <= ampMin) {
        ampMinReached.current = true;
        ampMaxReached.current = false;
      } else if (amplitude > ampMin) {
        setAmplitude((amplitude) => amplitude - amplitudeChange);
      }
    }
    if (!freqMaxReached.current) {
      if (frequency >= freqMax) {
        freqMaxReached.current = true;
        freqMinReached.current = false;
      } else if (frequency < freqMax) {
        setFrequency((frequency) => frequency + frequencyChange);
      }

    } else if (!freqMinReached.current) {
      if (frequency <= freqMin) {
        freqMinReached.current = true;
        freqMaxReached.current = false;
      } else if (frequency > freqMin) {
        setFrequency((frequency) => frequency - frequencyChange);
      }
    }
}, [setAmplitude, setFrequency, ampMaxReached, ampMinReached, amplitude, ampMax, ampMin, freqMaxReached, freqMinReached, frequency, freqMax, freqMin]);


useEffect(() => {
  const animationID = requestAnimationFrame(updateWave);
  return () => {
    cancelAnimationFrame(animationID);
  };

}, [updateWave, ampMaxReached, ampMinReached, amplitude, freqMaxReached, freqMinReached]);

useEffect(() => {
  const animationID = requestAnimationFrame(drawWave);
  return () => {
    cancelAnimationFrame(animationID);
  };
}, [drawWave]);


//  mouse stuff, position and click events:
useEffect(() => {
  const throttleMouseMove = throttle((event) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  }, 50);
  window.addEventListener("mousemove", throttleMouseMove);
  return () => {
    window.removeEventListener("mousemove", throttleMouseMove);
  };
}, []);
useEffect(() => {
  const handleClick = () => {
    setOnClick((prevOnclick) => !prevOnclick);
  };
  window.addEventListener("click", handleClick);
  return () => {
    window.removeEventListener("click", handleClick);
  };
}, []);


// phase variance; chnages over time, and is slightly more likely to speed up:
useEffect(() => {
  if (canvasRef) {
    setPhase(phase => phase + Math.random() < 0.04 ? phase - 0.002 : phase + 0.00125)
  };
}, [phase]);

// chokey chokey

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
    onMouseMove={(event => setMousePos({ x: event.clientX, y: event.clientY }))}
  ></canvas>
);
};

export default Wavy;



















// const ampModOne = onClick ? Math.sin(mousePos.x%(x - canvas.width)): 0;
// const ampModTwo = onClick ? Math.sin(mousePos.y%(x  - canvas.width)): 0;
// const ampModThree = onClick ? (mousePos.y * mousePos.x)%(x  - canvas.width)-phase: 0;

// Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() * Math.sin(ampModThree)