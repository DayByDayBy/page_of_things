import React, { useState, useEffect, useRef } from "react";
import "./Wavy.css"

const Wavy = () => {
  const canvasRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0.0001);
  const [amplitude, setAmplitude] = useState(20);
  const [frequency, setFrequency] = useState(0.000001);
  const [onClick, setOnClick] = useState(false);


  const frequencyChange = 0.0001;
  const amplitudeChange = 0.003;
  const amplitudeMax = 20;
  const amplitudeMin = 0.01;


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


        // basic wave stuff, if you're curious:
        // y = Math.sin(x) * (frequency modifier)
        // y = (amplitude modifier) + Math.sin(x)
        // the more complicated looking stuff is basically doing variations 
        // of that to change wave amplitude and frequency, and wavelngth is 
        // just inversely related to frequency. 
        // canvas.height/2 places it in the middle of the defined canvas

        // const ampModOne = onClick ? Math.sin(mousePos.x%(x - canvas.width)): 0;
        // const ampModTwo = onClick ? Math.sin(mousePos.y%(x  - canvas.width)): 0;
        // const ampModThree = onClick ? (mousePos.y * mousePos.x)%(x  - canvas.width)-phase: 0;

        // Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() * Math.sin(ampModThree)


        const y = canvas.height / 2 + amplitude * Math.sin((x + phase) * frequency);
        console.log(amplitude, frequency);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "hsla(0, 0%, 0%, 0.99)";
      ctx.stroke();
    };

    const animationID = requestAnimationFrame(drawWave);
    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [phase, amplitude, frequency, mousePos, onClick]);



  useEffect(() => {
    let ampMaxReached = false;
    let ampMinReached = false;
    let freqMaxReached = false;
    let freqMinReached = false;

    const updateWave = () => {

      if (!ampMaxReached) {
        setAmplitude((amplitude) => amplitude + amplitudeChange);
        if (amplitude >= amplitudeMax) {
          setAmplitude(amplitudeMax);
          ampMaxReached = true;
        }
      } else if (!ampMinReached) {
        setAmplitude((amplitude) => amplitude - amplitudeChange);
        if (amplitude >= amplitudeMin) {
          setAmplitude(amplitudeMin);
          ampMinReached = true;
        }
      } else {
        let ampMaxReached = false;
        let ampMinReached = false;

      }

      // if (frequency >= 3) {
      //   freqIncrease = false;
      // } else if (frequency <= 0.000001) {
      //   freqIncrease = true;
      // }

      // if (freqMaxReached) {
      //   setFrequency((frequency) => Math.min(frequency + frequencyChange, 3));
      // } else if (freqMinReached) {
      //   setFrequency((frequency) => Math.max(frequency - frequencyChange, 0.000001));
      // }
      setPhase((phase) => phase + Math.random() < 0.03 ? phase - 0.01 : phase + 0.01);


    };

    const animationID = requestAnimationFrame(updateWave);
    return () => {
      cancelAnimationFrame(animationID);
    };

  }, [amplitude, frequency]);


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
    setPhase(phase => phase + Math.random() < 0.04 ? phase - 0.002 : phase + 0.00125);
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
