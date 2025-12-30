import React, { useState } from "react";
import WaveSVG from "../../assets/wave.svg";
import ModButton from "./ModButton";
import OscilloscopeDisplay from "./OscilloscopeDisplay";
import Readout from "./Readout";

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

                <div title="on/off for amplitude modulation">
                    <ModButton
                        label="AM"
                        active={amActive}
                        onClick={() => setAmActive(!amActive)}
                        description="amplitude modulation toggle"
                        disabled={!systemActive}
                        className="amMainButton"
                    />
                </div>

                <div title="on/off for frequency modulation">
                    <ModButton
                        label="FM"
                        active={fmActive}
                        onClick={() => setFmActive(!fmActive)}
                        description="frequency modulation toggle"
                        disabled={!systemActive}
                        className="fmMainButton"
                    />
                </div>
                <div title="AM1(x) = A₁ sin(2π fₜ x)">
                    <ModButton
                        label="AM1"
                        active={am1Active}
                        onClick={() => setAm1Active(!am1Active)}
                        description="AM one"
                        disabled={!systemActive || !amActive}
                        className="am1Button"
                    />
                </div>

                <div title="FM1(x) = I₁ sin(2π f_m x)">
                    <ModButton
                        label="FM1"
                        active={fm1Active}
                        onClick={() => setFm1Active(!fm1Active)}
                        description="FM one"
                        disabled={!systemActive || !fmActive}
                        className="fm1Button"
                    />
                </div>

                <div title="AM2(x) = A₂ sin(2π f_r x) · sin(2π f_c x)">
                    <ModButton
                        label="AM2"
                        active={am2Active}
                        onClick={() => setAm2Active(!am2Active)}
                        description="AM two"
                        disabled={!systemActive || !amActive}
                        className="am2Button"
                    /></div>
                <div title="FM2(x) = I₂ sin(2π f_m(mouse) x)">
                    <ModButton
                        label="FM2"
                        active={fm2Active}
                        onClick={() => setFm2Active(!fm2Active)}
                        description="FM two"
                        disabled={!systemActive || !fmActive}
                        className="fm2Button"
                    />
                </div>

                <div title="AM3(x) = (A₃ + ΔA₃ · |x_mouse|) sin(2π f_m x)">
                    <ModButton
                        label="AM3"
                        active={am3Active}
                        onClick={() => setAm3Active(!am3Active)}
                        description="AM three"
                        disabled={!systemActive || !amActive}
                        className="am3Button"
                    />
                </div>

                <div title="FM3(x) = I₃ (sin(2π f_m x) + 0.5 sin(2π 2 f_m x))">
                    <ModButton
                        label="FM3"
                        active={fm3Active}
                        onClick={() => setFm3Active(!fm3Active)}
                        description="FM three"
                        disabled={!systemActive || !fmActive}
                        className="fm3Button"
                    />
                </div>
            </div>
        </div>
    );
}

const WaveControls = ({ modState, dispatch, oscilloscopeRef, readoutSamplesRef }) => {
    const [menuExpanded, setMenuExpanded] = useState(false);

    const {
        systemActive,
        amActive,
        fmActive,
        am1Active,
        am2Active,
        am3Active,
        fm1Active,
        fm2Active,
        fm3Active,
    } = modState;

    return (
        <div className="wavy-controls-grid">
            <ModulationControls
                menuExpanded={menuExpanded}
                setMenuExpanded={setMenuExpanded}
                systemActive={systemActive}
                setSystemActive={(v) => dispatch({ type: "setSystemActive", payload: v })}
                amActive={amActive}
                setAmActive={(v) => dispatch({ type: "setAmActive", payload: v })}
                fmActive={fmActive}
                setFmActive={(v) => dispatch({ type: "setFmActive", payload: v })}
                am1Active={am1Active}
                setAm1Active={(v) => dispatch({ type: "setAm1Active", payload: v })}
                am2Active={am2Active}
                setAm2Active={(v) => dispatch({ type: "setAm2Active", payload: v })}
                am3Active={am3Active}
                setAm3Active={(v) => dispatch({ type: "setAm3Active", payload: v })}
                fm1Active={fm1Active}
                setFm1Active={(v) => dispatch({ type: "setFm1Active", payload: v })}
                fm2Active={fm2Active}
                setFm2Active={(v) => dispatch({ type: "setFm2Active", payload: v })}
                fm3Active={fm3Active}
                setFm3Active={(v) => dispatch({ type: "setFm3Active", payload: v })}
            />
            {systemActive && (
                <>
                    <OscilloscopeDisplay ref={oscilloscopeRef} />
                    <Readout samplesRef={readoutSamplesRef} flags={modState} />
                </>
            )}
        </div>
    );
};

export default WaveControls;
