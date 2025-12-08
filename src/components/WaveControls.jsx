import React, { useState } from "react";
import WaveSVG from "../assets/wave.svg";
import ModButton from "./Wavy/ModButton";
import OscilloscopeDisplay from "./Wavy/OscilloscopeDisplay";
import Readout from "./Wavy/Readout";
import "../styles/WaveControls.css";

function ModulationControls({
  menuExpanded,
  setMenuExpanded,
  systemActive,
  setSystemActive,
  amActive,
  setAmActive,
  fmActive,
  setFmActive,
  am1Active,
  setAm1Active,
  am2Active,
  setAm2Active,
  am3Active,
  setAm3Active,
  fm1Active,
  setFm1Active,
  fm2Active,
  setFm2Active,
  fm3Active,
  setFm3Active,
}) {
  return (
    <div className="modulation-controls-container">
      <button
        className="toggle-modulation-menu"
        onClick={() => setMenuExpanded(!menuExpanded)}
        aria-expanded={menuExpanded}
        aria-controls="modulation-controls"
        aria-label={
          menuExpanded ? "Hide modulation controls" : "Show modulation controls"
        }
      >
        <img
          src={WaveSVG}
          alt="Wave Icon"
          className={`wave-icon ${menuExpanded ? "expanded" : ""}`}
        />
      </button>

      <div
        id="modulation-controls"
        className={`modulation-controls ${menuExpanded ? "visible" : ""}`}
        role="group"
        aria-label="Wave modulation controls"
      >
        <ModButton
          label="⏻"
          active={systemActive}
          onClick={() => setSystemActive(!systemActive)}
          isMain
        />

        <ModButton
          label="AM"
          active={amActive}
          onClick={() => setAmActive(!amActive)}
          description="amplitude modulation toggle"
          disabled={!systemActive}
          className="amMainButton"
        />

        <ModButton
          label="FM"
          active={fmActive}
          onClick={() => setFmActive(!fmActive)}
          description="frequency modulation toggle"
          disabled={!systemActive}
          className="fmMainButton"
        />

        <ModButton
          label="AM1"
          active={am1Active}
          onClick={() => setAm1Active(!am1Active)}
          description="AM one"
          formula="AM1(x) = A_{1} \sin(2\pi f_{t} x)"
          disabled={!amActive}
          className="am1Button"
          
        />

        <ModButton
          label="FM1"
          active={fm1Active}
          onClick={() => setFm1Active(!fm1Active)}
          description="FM one"
          disabled={!fmActive}
          className="fm1Button"
        />

        <ModButton
          label="AM2"
          active={am2Active}
          onClick={() => setAm2Active(!am2Active)}
          description="AM two"
          disabled={!amActive}
          className="am2Button"
        />

        <ModButton
          label="FM2"
          active={fm2Active}
          onClick={() => setFm2Active(!fm2Active)}
          description="FM two"
          disabled={!fmActive}
          className="fm2Button"
        />

        <ModButton
          label="AM3"
          active={am3Active}
          onClick={() => setAm3Active(!am3Active)}
          description="AM three"
          disabled={!amActive}
          className="am3Button"
        />

        <ModButton
          label="FM3"
          active={fm3Active}
          onClick={() => setFm3Active(!fm3Active)}
          description="FM three"
          disabled={!fmActive}
          className="fm3Button"
        />
      </div>
    </div>
  );
}

const WaveControls = ({
  systemActive,
  modulationState,
  setSystemActive,
  setAmActive,
  setFmActive,
  setAm1Active,
  setAm2Active,
  setAm3Active,
  setFm1Active,
  setFm2Active,
  setFm3Active,
  samplesRef,
  mousePosition,
}) => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const {
    amActive,
    fmActive,
    am1Active,
    am2Active,
    am3Active,
    fm1Active,
    fm2Active,
    fm3Active,
  } = modulationState;

  return (
    <div className="wave-controls-wrapper">
      <ModulationControls
        menuExpanded={menuExpanded}
        setMenuExpanded={setMenuExpanded}
        systemActive={systemActive}
        setSystemActive={setSystemActive}
        amActive={amActive}
        setAmActive={setAmActive}
        fmActive={fmActive}
        setFmActive={setFmActive}
        am1Active={am1Active}
        setAm1Active={setAm1Active}
        am2Active={am2Active}
        setAm2Active={setAm2Active}
        am3Active={am3Active}
        setAm3Active={setAm3Active}
        fm1Active={fm1Active}
        setFm1Active={setFm1Active}
        fm2Active={fm2Active}
        setFm2Active={setFm2Active}
        fm3Active={fm3Active}
        setFm3Active={setFm3Active}
      />
      {systemActive && (
        <>
          <OscilloscopeDisplay samplesRef={samplesRef} />
          <Readout samplesRef={samplesRef} flags={modulationState} />
        </>
      )}
    </div>
  );
};

export default WaveControls;
