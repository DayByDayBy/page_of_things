import './App.css';
import { useState, useRef } from 'react';
import WaveBackground from './components/WaveBackground';
import WaveControls from './components/WaveControls';
import { useMousePosition } from './hooks/useMousePosition';
import PageContainer from './container/PageContainer';

function App() {
  const mousePosition = useMousePosition(50);

  const [systemActive, setSystemActive] = useState(false);
  const [modulationState, setModulationState] = useState({
    amActive: false,
    fmActive: false,
    am1Active: false,
    am2Active: false,
    am3Active: false,
    fm1Active: false,
    fm2Active: false,
    fm3Active: false,
  });

  const samplesRef = useRef([]);

  const handleSetSystemActive = (value) => {
    setSystemActive(value);
    if (!value) {
      setModulationState({
        amActive: false,
        fmActive: false,
        am1Active: false,
        am2Active: false,
        am3Active: false,
        fm1Active: false,
        fm2Active: false,
        fm3Active: false,
      });
    }
  };

  const handleSetAmActive = (value) => {
    setModulationState((prev) => ({
      ...prev,
      amActive: value,
      ...(value
        ? {}
        : { am1Active: false, am2Active: false, am3Active: false }),
    }));
  };

  const handleSetFmActive = (value) => {
    setModulationState((prev) => ({
      ...prev,
      fmActive: value,
      ...(value
        ? {}
        : { fm1Active: false, fm2Active: false, fm3Active: false }),
    }));
  };

  const makeFlagSetter = (key) => (value) => {
    setModulationState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <WaveBackground
        mousePosition={mousePosition}
        modulationState={modulationState}
        systemActive={systemActive}
        samplesRef={samplesRef}
      />

      <main>
        <div className="content-grid">
          <aside className="controls-column">
            <WaveControls
              systemActive={systemActive}
              modulationState={modulationState}
              setSystemActive={handleSetSystemActive}
              setAmActive={handleSetAmActive}
              setFmActive={handleSetFmActive}
              setAm1Active={makeFlagSetter('am1Active')}
              setAm2Active={makeFlagSetter('am2Active')}
              setAm3Active={makeFlagSetter('am3Active')}
              setFm1Active={makeFlagSetter('fm1Active')}
              setFm2Active={makeFlagSetter('fm2Active')}
              setFm3Active={makeFlagSetter('fm3Active')}
              samplesRef={samplesRef}
              mousePosition={mousePosition}
            />
          </aside>

          <section className="main-column">
            <div className="page-content">
              <PageContainer />
            </div>
          </section>

          <div className="spacer-column" aria-hidden="true" />
        </div>
      </main>
    </>
  );
}

export default App;

