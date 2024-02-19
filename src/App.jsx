import './App.css';
import Wavy from './components/Wavy/Wavy';
import PageContainer from './container/PageContainer';

function App() {
  return (
    <>
      <main>
                    <PageContainer />
            <div className='wave-container'>
                      <Wavy />
            </div>

      </main>
    </>
  );


}



export default App;
