import React, { useEffect, useRef } from "react";
import { useMousePosition } from "../../hooks/useMousePosition";
import "./Wavy.css"

function updateWave(amplitudeRef, frequencyRef, flags, constants) {
  const { ampMaxReached, ampMinReached, freqMaxReached, freqMinReached } = flags;
  const { amplitudeChange, frequencyChange, ampMax, ampMin, freqMax, freqMin } = constants;

  const amplitude = amplitudeRef.current;
  const frequency = frequencyRef.current;

  if (!ampMaxReached.current) {
    if (amplitude >= ampMax) {
      ampMaxReached.current = true;
      ampMinReached.current = false;
    } else if (amplitude < ampMax) {
      amplitudeRef.current = amplitude + (amplitudeChange * Math.random());
    }
  } else if (!ampMinReached.current) {
    if (amplitude <= ampMin) {
      ampMinReached.current = true;
      ampMaxReached.current = false;
    } else if (amplitude > ampMin) {
      amplitudeRef.current = amplitude - amplitudeChange;
    }
  }

  if (!freqMaxReached.current) {
    if (frequency >= freqMax) {
      freqMaxReached.current = true;
      freqMinReached.current = false;
    } else if (frequency < freqMax) {
      frequencyRef.current = frequency + (frequencyChange * Math.random());
    }
  } else if (!freqMinReached.current) {
    if (frequency <= freqMin) {
      freqMinReached.current = true;
      freqMaxReached.current = false;
    } else if (frequency > freqMin) {
      frequencyRef.current = frequency - frequencyChange;
    }
  }
}

function updatePhase(phaseRef) {
  const random = Math.random();
  phaseRef.current += random < 0.01 ? -0.000012 : 0.0000125;
}

function drawWave(ctx, canvas, { amplitude, frequency, phase, mousePos, modOneActive, modTwoActive, modThreeActive, modMainActive }) {
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
}


const Wavy = (props) => {
  const canvasRef = useRef();

  const phaseRef = useRef(0.000000001);
  const amplitudeRef = useRef(10);
  const frequencyRef = useRef(0.0101);

  const ampMaxReached = useRef(false);
  const ampMinReached = useRef(false);
  const freqMaxReached = useRef(false);
  const freqMinReached = useRef(false);

  const { 
    modOneActive, 
    modTwoActive,
    modThreeActive,
    modMainActive 
  } = props;

  

  const mousePos = useMousePosition(50);
  // const [onClick, setOnClick] = useState(false);
  // const [modulation, setModulation] = useState(null);


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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const flags = {
      ampMaxReached,
      ampMinReached,
      freqMaxReached,
      freqMinReached,
    };

    const constants = {
      frequencyChange,
      amplitudeChange,
      ampMax,
      ampMin,
      freqMax,
      freqMin,
    };

    let frameId;
    const render = () => {
      updateWave(amplitudeRef, frequencyRef, flags, constants);
      updatePhase(phaseRef);
      drawWave(ctx, canvas, {
        amplitude: amplitudeRef.current,
        frequency: frequencyRef.current,
        phase: phaseRef.current,
        mousePos,
        modOneActive,
        modTwoActive,
        modThreeActive,
        modMainActive,
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [modOneActive, modTwoActive, modThreeActive, modMainActive, mousePos]);




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

  return (
    <>

      <canvas
        ref={canvasRef}
        width={document.documentElement.clientWidth}
        height={document.documentElement.clientHeight / 2}
      ></canvas>
    </>
  );
};

export default Wavy;



















// const ampModOne = onClick ? Math.sin(mousePos.x%(x - canvas.width)): 0;
// const ampModTwo = onClick ? Math.sin(mousePos.y%(x  - canvas.width)): 0;
// const ampModThree = onClick ? (mousePos.y * mousePos.x)%(x  - canvas.width)-phase: 0;

// Math.sin(ampModOne) + Math.sin(ampModTwo) + Math.random() * Math.sin(ampModThree)