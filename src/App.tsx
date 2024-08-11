import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsSpin, faUserTie, faChartPie, faChartLine, faChartColumn, faQuestion, faLightbulb, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import FloatingBubble from './FloatingBubble';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FontAwesomeIcon icon={faArrowsSpin} className="App-logo" />
        <div className='worries'>
          <FloatingBubble text="worries" />
          {/* <FontAwesomeIcon icon={faQuestion} className="icon-question" /> */}
          <FontAwesomeIcon icon={faCircleNotch} className="icon-circle" spin />
          <FontAwesomeIcon icon={faUserTie} className="icon-user" />
        </div>
        <div className='indexes'>
          <FloatingBubble text="index" />
          <FontAwesomeIcon icon={faChartPie} className="icon-index-pie" />
          <FontAwesomeIcon icon={faChartLine} className="icon-index-line" />
          <FontAwesomeIcon icon={faChartColumn} className="icon-index-column" />
          <p className="icon-index-ai">AI</p>
        </div>
        <div className='innovation'>
          <FloatingBubble text="innovation" />
          <FontAwesomeIcon icon={faLightbulb} className="icon-light" bounce />
          <FontAwesomeIcon icon={faUserTie} className="icon-decider" />
        </div>
      </header>
    </div>
  );
}

export default App;
