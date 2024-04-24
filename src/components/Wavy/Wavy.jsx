import React, { useState, useEffect, useRef, useCallback } from "react";
import ModButton from "./ModButton";
import "./Wavy.css"



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
  // const [onClick, setOnClick] = useState(false);
  // const [modulation, setModulation] = useState(null);

  const [modOneActive, setModOneActive] = useState(false);
  const [modTwoActive, setModTwoActive] = useState(false);
  const [modThreeActive, setModThreeActive] = useState(false);
  const [modMainActive, setModMainActive] = useState(false);

  const frequencyChange = 0.0002533333;
  const amplitudeChange = 0.075;
  const ampMax = 40;
  const ampMin = 0;
  const freqMax = 1;
  const freqMin = 0.01;

  // basic wave stuff, if you're curious:
  // y = Math.sin(x) * (frequency modifier)
  // y = (amplitude modifier) + Math.sin(x)
  // the more complicated looking stuff is just variations on that basic form
  // to change wave amplitude and frequency (and wavelength is inversely related to frequency).
  // canvas.height/2 places it in the middle of the defined canvas, nudged slightly 
  // to the side because canvas draws a weird line at the edge of waves and i wanted a cleaner look

  const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(-4, canvas.height / 2);
    const numPoints = 5000;
    const stepSize = canvas.width / numPoints;
    for (let x = 0; x < canvas.width; x += (stepSize)) {

      //  wave modulation ternaries - a quick and dirty implementation 
      // of the idea (three sets of mod, one overall sum value)
      // some cool effects by messing with that wave, would be cool to 
      // make a button/mod selector switch to turn on 1, 2, and/or 3, 
      // and to add some other buttons/sliders to adjust the wave further. 
      // 
      // maybe multiply ampMod, either individually or altogether, possibly both, 
      // possibly in combination - also might be interesting to incorporate 
      // the date/time as a variable, or some user-set or user-derived numbers

      const ampModOne = modOneActive ? Math.sin(mousePos.x % (x - canvas.width)) : 0;
      const ampModTwo = modTwoActive ? Math.sin(mousePos.y % (x - canvas.width)) : 0;
      const ampModThree = modThreeActive ? (mousePos.y * mousePos.x) % (x - canvas.width) - phase : 0;
      const ampModMain = modMainActive ? 10 * (Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() * Math.sin(ampModThree)) : 0;

      // a few of the other wave mod ideas:

      //  const ampModMain = !onClick ? 0: 10*(Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() * Math.sin(ampModThree))
      //  const ampModMain = !onClick ? 0: 10*(Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() / Math.sin(ampModThree))
      //  const ampModMain = !onClick ? 0: 10/(Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() - Math.sin(ampModThree))
      //  const ampModMain = !onClick ? 0: (Math.sin(ampModOne) + Math.sin(ampModTwo) + (Date.now()/80000000000) - Math.sin(ampModThree))
      //  const ampModMain = !onClick ? 0: (Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.sqrt(Date.now()) * Math.sin(ampModThree))
      //  const ampModMain = !onClick ? 0: Math.sin(ampModOne) - Math.sin(ampModTwo) * Math.sin(ampModThree) / Math.cos(Date.now())      // this is one gets a bit wierd

      // issue with some more fun AM wave-shaping is that it can 
      // tend to hit the ceiling of the container if it's left 
      // uncapped, which looks bad/ruins the illusion
      // 
      // i also quite like the idea of giving the wave the whole page to play 
      // with (maybe using the z value to push it to the back of the CSS), but that 
      // isn't really in keeping with the look/style 

      // also, reminder to self, re-do the FM stuff you deleted, i think 
      // that may be more interesting than endless AM fiddling 

      const y = canvas.height / 2 + ampModMain + amplitude * Math.sin((x + phase) * (frequency / 10));

      ctx.lineTo(x, y);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsla(0, 0%, 0%, 0.99)`;

    }
    ctx.stroke();
  }, [amplitude, frequency, phase, mousePos, modOneActive, modTwoActive, modThreeActive, modMainActive]);



  const handleModOneToggle = () => {
    setModOneActive(prevModOneActive => !prevModOneActive);
  }
  const handleModTwoToggle = () => {
    setModTwoActive(prevModTwoActive => !prevModTwoActive);
  };
  const handleModThreeToggle = () => {
    setModThreeActive(prevModThreeActive => !prevModThreeActive);
  }
  const handleModMainToggle = () => {
    setModMainActive(prevModMainActive => !prevModMainActive);
  }


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

  // commenting out this bit rather than deleting because i think will use it for 
  // something else, but for now it is getting in the way of my modulation buttons

  // useEffect(() => {
  //   const handleClick = () => {
  //     handleModMaintoggle();
  //     // setFrequency((prevFreq) => prevFreq - (prevFreq / 3));
  //     // setAmplitude(amplitude/3);
  //     // setPhase(0.0000000125);
  //   };
  //   window.addEventListener("click", handleClick);
  //   return () => {
  //     window.removeEventListener("click", handleClick);
  //   };
  // }, []);

  useEffect(() => {
    const throttleMouseMove = throttle((event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    }, 50);
    window.addEventListener("mousemove", throttleMouseMove);
    return () => {
      window.removeEventListener("mousemove", throttleMouseMove);
    };
  }, []);


  // phase variance; value changes over time, and is more likely to speed up than slow down:
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
      <div className='modulation-controls'>

        <ModButton
          label={`toggle AM: ${modMainActive ? 'ON' : 'OFF'}`} 
          active={modMainActive} 
          onClick={handleModMainToggle}/>

        <ModButton label={`mod1: ${modOneActive ? 'ON' : 'OFF'}`}  active={modOneActive} onClick={handleModOneToggle} />
        <ModButton label={`mod1: ${modTwoActive ? 'ON' : 'OFF'}`} active={modTwoActive} onClick={handleModTwoToggle} />
        <ModButton label={`mod1: ${modThreeActive ? 'ON' : 'OFF'}`} active={modThreeActive} onClick={handleModThreeToggle} />


      </div>


    </>
  );
};

export default Wavy;



















// const ampModOne = onClick ? Math.sin(mousePos.x%(x - canvas.width)): 0;
// const ampModTwo = onClick ? Math.sin(mousePos.y%(x  - canvas.width)): 0;
// const ampModThree = onClick ? (mousePos.y * mousePos.x)%(x  - canvas.width)-phase: 0;

// Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() * Math.sin(ampModThree)