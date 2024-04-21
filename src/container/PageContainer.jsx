import NavBar from "../components/NavBar";
import Menu from "../components/Menu/Menu";
import { useState, useEffect } from "react";

const PageContainer = () => {
  
  const [modBoolean, setModBoolean] = useState(false);
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
    <>
      <div className="name">
        <h3>boagDev</h3>
      </div>
    
      {/* <Menu onSelect={handleModSelect}/> */}
      <NavBar />
      <p className="text">
        theboag<br></br>[@]<br></br>gmail
      </p>
      <div className="readout">
        {/* AM: {(modBoolean ? 'on' : 'off')}<br></br> */}
        X: {mousePosition.x} <br></br>
        Y: {mousePosition.y}
      </div>
    </>
  );
};

export default PageContainer;
