import { useState } from 'react';
import './App.css';
import Wavy from './components/Wavy/Wavy';
import PageContainer from './container/PageContainer';
import ModulationControls from './components/Wavy/ModControls';

function App() {

  const [mods, setMods] = useState({
    AM: false,
    Wave1: false,
    Wave2: false,
    Wave3: false,
  });

  const handleButtonClicked = (key) => {
    setMods((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <ModulationControls
        handleButtonClicked={handleButtonClicked}
        modMainActive={mods.AM}
        modOneActive={mods.Wave1}
        modTwoActive={mods.Wave2}
        modThreeActive={mods.Wave3}
      />
      <main>

        <div className="page-content">
          <PageContainer />
        </div>
        <div className='wave-container'>
          <div className='wave'>
            <Wavy
              handleButtonClicked={handleButtonClicked}
              modMainActive={mods.AM}
              modOneActive={mods.Wave1}
              modTwoActive={mods.Wave2}
              modThreeActive={mods.Wave3}
            />
          </div>
        </div>
      </main>
    </>
  );

};

export default App;