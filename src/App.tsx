import React from 'react';
import logo from './logo.svg';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FontAwesomeIcon icon={faArrowsSpin} className="App-logo" spin />
        {/* <img src={logo} alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
