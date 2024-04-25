import React from 'react';
import ModButton from './ModButton';
import WaveSVG from "../../assets/wave_icon.svg";


const ModulationControls = ({ modMainActive, modOneActive, modTwoActive, modThreeActive, handleModMainToggle, handleModOneToggle, handleModTwoToggle, handleModThreeToggle }) => {
    return (
        <>
            <div className="modulation-controls-container">
                <button className='toggle-modulation-button' onClick={handleToggleModulation}>
                    <WaveSVG />
                </button>
                <div className='modulation-controls'>
                    <ModButton
                        className='mainModButton'
                        label={`AM is ${modMainActive ? 'ON' : 'OFF'}`}
                        active={modMainActive}
                        onClick={handleModMainToggle}
                        isMain={true}
                        description='toggles amplitude modulation' />

                    <ModButton label={`wave 1 is ${modOneActive ? 'ON' : 'OFF'}`} active={modOneActive} onClick={handleModOneToggle} description='toggles modulation wave 1' />
                    <ModButton label={`wave 2 is ${modTwoActive ? 'ON' : 'OFF'}`} active={modTwoActive} onClick={handleModTwoToggle} description='toggles modulation wave 2' />
                    <ModButton label={`wave 3 is ${modThreeActive ? 'ON' : 'OFF'}`} active={modThreeActive} onClick={handleModThreeToggle} description='toggles modulation wave 3' />

                </div>
            </div>
        </>
    );

};

export default ModulationControls;