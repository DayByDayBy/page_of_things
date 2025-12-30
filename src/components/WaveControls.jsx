import React, { useState } from "react";
import WaveSVG from "../assets/wave.svg";
import ModButton from "./Wavy/ModButton";
import OscilloscopeDisplay from "./Wavy/OscilloscopeDisplay";
import Readout from "./Wavy/Readout";
import "../styles/Wave.css";

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
          description="on/off for amplitude modulation"
          disabled={!systemActive}
          className="amMainButton"
        />

        <ModButton
          label="FM"
          active={fmActive}
          onClick={() => setFmActive(!fmActive)}
          description="on/off for frequency modulation"
          disabled={!systemActive}
          className="fmMainButton"
        />

        <ModButton
          label="AM1"
          active={am1Active}
          onClick={() => setAm1Active(!am1Active)}
          description="AM one"
          formula="AM1(x) = A₁ sin(2π fₜ x)"
          disabled={!systemActive || !amActive}
          className="am1Button"
        />

        <ModButton
          label="FM1"
          active={fm1Active}
          onClick={() => setFm1Active(!fm1Active)}
          description="FM one"
          formula="FM1(x) = I₁ sin(2π f_m x)"
          disabled={!systemActive || !fmActive}
          className="fm1Button"
        />

        <ModButton
          label="AM2"
          active={am2Active}
          onClick={() => setAm2Active(!am2Active)}
          description="AM two"
          formula="AM2(x) = A₂ sin(2π f_r x) · sin(2π f_c x)"
          disabled={!systemActive || !amActive}
          className="am2Button"
        />

        <ModButton
          label="FM2"
          active={fm2Active}
          onClick={() => setFm2Active(!fm2Active)}
          description="FM two"
          formula="FM2(x) = I₂ sin(2π f_m(mouse) x)"
          disabled={!systemActive || !fmActive}
          className="fm2Button"
        />

        <ModButton
          label="AM3"
          active={am3Active}
          onClick={() => setAm3Active(!am3Active)}
          description="AM three"
          formula="AM3(x) = (A₃ + ΔA₃ · |x_mouse|) sin(2π f_m x)"
          disabled={!systemActive || !amActive}
          className="am3Button"
        />

        <ModButton
          label="FM3"
          active={fm3Active}
          onClick={() => setFm3Active(!fm3Active)}
          description="FM three"
          formula="FM3(x) = I₃ (sin(2π f_m x) + 0.5 sin(2π 2 f_m x))"
          disabled={!systemActive || !fmActive}
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
