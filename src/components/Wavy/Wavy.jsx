import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Wavy.css"
import Menu from "../Menu/Menu";


const Wavy = () => {
  const canvasRef = useRef();

  const [phase, setPhase] = useState(0.000000001);
  const [amplitude, setAmplitude] = useState(10);
  const [frequency, setFrequency] = useState(0.0101);

  const ampMaxReached = useRef(false);
  const ampMinReached = useRef(false);
  const freqMaxReached = useRef(false);
  const freqMinReached = useRef(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [onClick, setOnClick] = useState(false);

  const frequencyChange = 0.000253333333;
  const amplitudeChange = 0.075;
  const ampMax = 40;
  const ampMin = 0;
  const freqMax = 1;
  const freqMin = 0.01;

  // basic wave stuff, if you're curious:
  // y = Math.sin(x) * (frequency modifier)
  // y = (amplitude modifier) + Math.sin(x)
  // the more complicated looking stuff is basically doing variations 
  // of that to change wave amplitude and frequency, and wavelength is 
  // just inversely related to frequency. 
  // canvas.height/2 places it in the middle of the defined canvas, nudged slighly 
  // to the side because canvas draws a weird line at the edge of waves

    const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(-4, canvas.height / 2);
    const numPoints = 5000;
    const stepSize = canvas.width / numPoints;
    for (let x = 0; x < canvas.width; x += (stepSize)) {
      const y = canvas.height / 2 + amplitude * Math.sin((x + phase) * (frequency/10));
      ctx.lineTo(x, y);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsla(0, 0%, 0%, 0.99)`;

    }
    ctx.stroke();
  }, [amplitude, frequency, phase]);

  const updateWave = useCallback(() => {
    if (!ampMaxReached.current) {
      if (amplitude >= ampMax) {
        ampMaxReached.current = true;
        ampMinReached.current = false;
      } else if (amplitude < ampMax) {
        setAmplitude((amplitude) => amplitude + (amplitudeChange * (Math.random())));
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
        setFrequency((frequency) => frequency + (frequencyChange * Math.random()));
      }

    } else if (!freqMinReached.current) {
      if (frequency <= freqMin) {
        // console.log("freq min reached... A:", amplitude);
        freqMinReached.current = true;
        freqMaxReached.current = false;
      } else if (frequency > freqMin) {
        setFrequency((frequency) => frequency - frequencyChange);
      }
    }
  }, [ampMin, ampMax, freqMin, freqMax, amplitude, frequency]);


  useEffect(() => {
    const animationID = requestAnimationFrame(updateWave);
    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [updateWave]);

  useEffect(() => {
    const animationID = requestAnimationFrame(drawWave);
    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [drawWave]);
  


  //  mouse stuff, position and click events:

  useEffect(() => {
    const handleClick = () => {
      setOnClick((prevOnclick) => !prevOnclick);
      setFrequency((prevFreq) => prevFreq - (prevFreq / 3));
      setAmplitude(10);
      setPhase(0.0000000125);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const throttleMouseMove = throttle((event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    }, 50);
    window.addEventListener("mousemove", throttleMouseMove);
    return () => {
      window.removeEventListener("mousemove", throttleMouseMove);
    };
  }, []);


  // phase variance; chnages over time, and is slightly more likely to speed up:
  useEffect(() => {
    if (canvasRef.current) {
      setPhase(phase => phase + Math.random() < 0.01 ? phase - 0.000012 : phase + 0.0000125)
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
<>


    <canvas
      ref={canvasRef}
      width={document.documentElement.clientWidth}
      height={document.documentElement.clientHeight / 2}
      onMouseMove={(event => setMousePos({ x: event.clientX, y: event.clientY }))}
    ></canvas>

</>
  );
};

export default Wavy;



















// const ampModOne = onClick ? Math.sin(mousePos.x%(x - canvas.width)): 0;
// const ampModTwo = onClick ? Math.sin(mousePos.y%(x  - canvas.width)): 0;
// const ampModThree = onClick ? (mousePos.y * mousePos.x)%(x  - canvas.width)-phase: 0;

// Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() * Math.sin(ampModThree)