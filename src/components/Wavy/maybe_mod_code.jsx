

// const [ampMod, setAmpMod] = useState(0);
// const [freqMod, setFreqMod] = useState(0);




// for (let x = 0; x < canvas.width; x += stepSize) {
//     const y =
//       canvas.height / 2 +
//       (amplitude + ampMod) * Math.sin((x + phase + freqMod) / (50 * frequency));
//     ctx.lineTo(x, y);
//   }





// useEffect(() => {
  //   const intervalId = setInterval(() => {

  //     if (canvasRef.current) {
  //       const canvasElement = canvasRef.current;

  //       const yDelta = (mousePos.y - canvasElement.height / 2);
  //       const xDelta = (mousePos.x - canvasElement.width / 2);
  //       const minAmpMod = -30;
  //       const maxAmpMod = 30;
  //       const minFreqMod = 100;
  //       const maxFreqMod = 10000;

        

  //       setAmpMod(Math.min(Math.max(ampMod + yDelta, minAmpMod), maxAmpMod));
  //       setFreqMod(Math.min(Math.max(freqMod + xDelta, minFreqMod), maxFreqMod));
    
  //     }

  //   }, 5);

  //   return () => clearInterval(intervalId);
  // }, [mousePos, ampMod, freqMod]);