import './App.css';
import Wavy from './components/Wavy/Wavy';
import PageContainer from './container/PageContainer';

function App() {
  return (
    <>
      <main>
        <PageContainer />
      </main>
      <div className="container">
        <Wavy />
      </div>

    </>
  );
}

export default App;
