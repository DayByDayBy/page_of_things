import './App.css';
import { useReducer, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import WaveBackground from './components/WaveBackground';
import WaveControls from './components/WaveControls';
import { useMousePosition } from './hooks/useMousePosition';
import PageContainer from './container/PageContainer';
import ProjectsPage from './pages/ProjectsPage';
import { initialModulationState, modulationReducer } from './state/modulationReducer';

function App() {
    const location = useLocation();
    const mousePosition = useMousePosition(50);

    const [modState, dispatch] = useReducer(modulationReducer, initialModulationState);

    const { systemActive, ...modulationState } = modState;

    const samplesRef = useRef([]);

    const handleSetSystemActive = (value) => {
        dispatch({ type: 'setSystemActive', payload: value });
    };

    const handleSetAmActive = (value) => {
        dispatch({ type: 'setAmActive', payload: value });
    };

    const handleSetFmActive = (value) => {
        dispatch({ type: 'setFmActive', payload: value });
    };

    const makeFlagSetter = (actionType) => (value) => {
        dispatch({ type: actionType, payload: value });
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
                            setAm1Active={makeFlagSetter('setAm1Active')}
                            setAm2Active={makeFlagSetter('setAm2Active')}
                            setAm3Active={makeFlagSetter('setAm3Active')}
                            setFm1Active={makeFlagSetter('setFm1Active')}
                            setFm2Active={makeFlagSetter('setFm2Active')}
                            setFm3Active={makeFlagSetter('setFm3Active')}
                            samplesRef={samplesRef}
                        />
                    </aside>

                    <section className="main-column">
                        <div
                            className={`page-content${location.pathname === '/projects' ? ' projects-page' : ''}`}
                        >
                            <Routes>
                                <Route path="/" element={<PageContainer />} />
                                <Route path="/projects" element={<ProjectsPage />} />
                            </Routes>

                        </div>
                        <p className="text">
                            <a href="mailto:lab@boag.dev">lab<br></br>[@]<br></br>boagdev</a>
                        </p>
                    </section>

                    <div className="spacer-column" aria-hidden="true" />
                </div>
            </main>
        </>
    );
}

export default App;

