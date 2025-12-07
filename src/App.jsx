import './App.css';
import Wavy from './components/Wavy/Wavy';
import PageContainer from './container/PageContainer';

function App() {
  return (
    <>
      <main>
        <div className="page-content">
          <PageContainer />
        </div>
        <div className="wave-container">
          <div className="wave">
            <Wavy />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

