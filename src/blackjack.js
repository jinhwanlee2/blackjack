import back from './cards/BACK.png'

import './blackjack.css';
import React, { useEffect, useState } from 'react';

import { buildDeck, shuffleDeck, startGame} from './blackjackUtil';


function App() {

  const [backendData, setBackendData] = useState([{}])
  useEffect(() => {

    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )

    const handleWindowLoad = () => {
      buildDeck();
      shuffleDeck();
      startGame();
    };

    window.onload = handleWindowLoad;

    return () => {
      window.onload = null; 
    };
  }, []);

  return (
    <div className="game">
      <h2>Dealer: <span id="dealer-sum"></span></h2>
      <div id="dealer-cards">
        <img id="hidden" src={back} alt="backside"/>
      </div>

      <h2 >You: <span id="your-sum"></span></h2>
      <div id="your-cards"></div>

      <br />
   
      <button id="hit">Hit</button>
      <button id="stand">Stand</button>
      <p id="results"></p>
    </div>
  );
}

export default App;
