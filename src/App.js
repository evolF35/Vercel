
import React, { useState } from 'react';
import SimpleStorage from './SimpleStorage';
import Event from './Events';
import './App.css';

function App() {
  // Declare a state variable called "activeComponent" with an initial value of "SimpleStorage"
  const [activeComponent, setActiveComponent] = useState('SimpleStorage');

  // Declare a function that updates the state when the button is clicked
  const handleClick = () => {
    setActiveComponent(activeComponent === 'SimpleStorage' ? 'OtherComponent' : 'SimpleStorage');
  };

  // Render the active component based on the value of "activeComponent"
  let component;
  if (activeComponent === 'SimpleStorage') {
    component = <SimpleStorage />;
  } else {
    component = <Event />;
  }

  return (
    <div className="App">
      <button onClick={handleClick}>Switch</button>
      {/* Render the active component */}
      {component}
      {/* Add a button that calls the "handleClick" function when clicked */}
    </div>
  );
}

export default App;


// import './App.css';
// import SimpleStorage from './SimpleStorage';

// function App() {
//   return (
//     <div className="App">
//       <SimpleStorage/>
//     </div>
//   );
// }

// export default App;



