

import { useState, useEffect } from "react";



const Readout = () => {
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
useEffect(() =>{
  const updateMousePosition = (e) =>{
    setMousePosition({ x: e.clientX, y: e.clientY });

  };
  document.addEventListener("mousemove", updateMousePosition);
  return () =>{
    document.removeEventListener("mousemove", updateMousePosition);
  };
}, []);


 return (

    <div className="readout">
    {/* AM: {(modBoolean ? 'on' : 'off')}<br></br> */}
    X: {mousePosition.x} <br></br>
    Y: {mousePosition.y}
  </div>
 )

};

export default Readout;