import React, { useState } from 'react';
import "./Wavy.css"
import ModButton from './ModButton';
import Readout from './Readout';
import WaveSVG from "../../assets/wave.svg";



const ModulationControls = ({
    modMainActive,
    modOneActive,
    modTwoActive,
    modThreeActive,
    handleButtonClicked
}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleToggleMenu = () => {
        setMenuVisible(prevMenuVisible => !prevMenuVisible);
    };


    return (
        <>

            <div className="modulation-controls-container">
            <button
                    className='toggle-modulation-menu'
                    onClick={handleToggleMenu}>
                    <img src={WaveSVG} alt="Wave Icon" className={`wave-icon ${menuVisible ? 'expanded' : ''}`} />
                </button>


                <div className={`modulation-controls ${menuVisible ? 'visible' : ''}`}>

                    <Readout />
                    <ModButton
                        className='mainModButton'
                        label={`AM ${modMainActive ? 'ON' : 'OFF'}`}
                        active={modMainActive}
                        onClick={() => {
                            handleButtonClicked('AM');
                        }}
                        isMain={true}
                        description='toggles amplitude modulation' />

                    <ModButton
                        label={`1 ${modOneActive ? 'ON' : 'OFF'}`}
                        active={modOneActive}
                        onClick={() => {
                            handleButtonClicked('Wave1');
                        }}
                        description='toggles modulation wave 1' />

                    <ModButton
                        label={`2 ${modTwoActive ? 'ON' : 'OFF'}`}
                        active={modTwoActive}
                        onClick={() => {
                            handleButtonClicked('Wave2');
                        }}
                        description='toggles modulation wave 2' />

                    <ModButton
                        label={`3 ${modThreeActive ? 'ON' : 'OFF'}`}
                        active={modThreeActive}
                        onClick={() => {
                            handleButtonClicked('Wave3');
                        }}
                        description='toggles modulation wave 3' />



                </div>

            </div>
        </>
    );

};

export default ModulationControls;


