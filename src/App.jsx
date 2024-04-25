import { useState } from 'react';
import './App.css';
import Wavy from './components/Wavy/Wavy';
import PageContainer from './container/PageContainer';
import ModulationControls from './components/Wavy/ModControls';

function App() {


  const [modOneActive, setModOneActive] = useState(false);
  const [modTwoActive, setModTwoActive] = useState(false);
  const [modThreeActive, setModThreeActive] = useState(false);
  const [modMainActive, setModMainActive] = useState(false);


  // const handleModOneToggle = () => {
  //   setModOneActive(prevModOneActive => !prevModOneActive);
  // };
  // const handleModTwoToggle = () => {
  //   setModTwoActive(prevModTwoActive => !prevModTwoActive);
  // };
  // const handleModThreeToggle = () => {
  //   setModThreeActive(prevModThreeActive => !prevModThreeActive);
  // };
  // const handleModMainToggle = () => {
  //   setModMainActive(prevState => !prevModMainActive);
  // };



  const buttonHandlers = {
    AM: setModMainActive,
    Wave1: setModOneActive,
    Wave2: setModTwoActive,
    Wave3: setModThreeActive
  };
  

const handleButtonClicked = (buttonName) => {
  console.log(buttonName);
  const toggleFunction = buttonHandlers[buttonName];
  console.log(toggleFunction);
  if (toggleFunction) {
    toggleFunction(prevState => !prevState);
  }
};


  // const handleButtonClicked = (buttonName) => {
  //   switch (buttonName) {
  //     case 'AM':
  //       setModMainActive(prevState => !prevState);
  //       break;
  //     case 'Wave1':
  //       setModOneActive(prevState => !prevState);
  //       break;
  //     case 'Wave2':
  //       setModTwoActive(prevState => !prevState);
  //       break;
  //     case 'Wave3':
  //       setModThreeActive(prevState => !prevState);
  //       break;
  //     default:
  //       break;
  //   }
  // };



  return (
    <>
      <ModulationControls

        modMainActive={modMainActive}
        modOneActive={modOneActive}
        modTwoActive={modTwoActive}
        modThreeActive={modThreeActive}
        handleButtonClicked={handleButtonClicked}

      />
      <main>

        <div className="page-content">
          <PageContainer />
        </div>
        <div className='wave-container'>
          <div className='wave'>
            <Wavy
              modMainActive={modMainActive}
              modOneActive={modOneActive}
              modTwoActive={modTwoActive}
              modThreeActive={modThreeActive}
              handleButtonClicked={handleButtonClicked}
            />
          </div>
        </div>
      </main>
    </>
  );


};



export default App;









  // const handleButtonClicked =(buttonName) => {
  //   const toggleFunction = buttonHandlers[buttonName];
  //   if (toggleFunction){
  //     toggleFunction(prevState => !prevState);
  //   }
  // };