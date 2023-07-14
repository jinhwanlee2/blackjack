import back from './cards/BACK.png'
import QH from './cards/Q-H.png'
import QS from './cards/Q-S.png'
import QD from './cards/Q-D.png'
import QC from './cards/Q-C.png'
import KH from './cards/K-H.png'
import KS from './cards/K-S.png'
import KD from './cards/K-D.png'
import KC from './cards/K-C.png'


import './blackjack.css';
import React, { useEffect } from 'react';

var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; 

var hidden;
var deck;

var canHit = true; 

function buildDeck() {
  let value = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  let suit = ["H", "C", "D", "S"];
  deck = [];

  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < value.length; j++) {
      deck.push(value[j] + "-" + suit[i]);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); 
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function startGame() {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
  while (reduceAce(dealerSum, dealerAceCount) < 17) {
    //<img src="./cards/4-C.png">
    let cardImg = document.createElement("img");
    let card = deck.pop();

    // DO cardImg.src = back 
    let newCard = card.replace('-', '');
    cardImg.src = newCard;
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
  }

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }

  document.getElementById("your-sum").innerText = yourSum;

  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stand").addEventListener("click", stand);
}

function getValue(card) {
  let data = card.split("-"); // "4-C" -> ["4", "C"]
  let value = data[0];

  if (isNaN(value)) { //A J Q K
    if (value === "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] === "A") {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function hit() {
  if (!canHit) {
    return;
  }

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = card + ".png";
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById("your-cards").append(cardImg);

  if (reduceAce(yourSum, yourAceCount) >= 21) { //A, J, 8 -> 1 + 10 + 8
    canHit = false;
  }
}

function stand() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;
  document.getElementById("hidden").src = hidden + ".png";

  let message = "";
  if (yourSum > 21) {
      message = "You Lose";
  }
  else if (dealerSum > 21) {
      message = "You win";
  }
  //both you and dealer <= 21
  else if (yourSum === dealerSum) {
      message = "Tie";
  }
  else if (yourSum > dealerSum) {
      message = "You Win";
  }
  else if (yourSum < dealerSum) {
      message = "You Lose";
  }

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;
}


function App() {

  useEffect(() => {
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
    <div>
      <h2>Dealer: <span id="dealer-sum"></span></h2>
      <div id="dealer-cards">
        <img id="hidden" src={back} alt="backside"/>
      </div>

      <h2>You: <span id="your-sum"></span></h2>
      <div id="your-cards"></div>

      <br />
      <button id="hit">Hit</button>
      <button id="stand">Stand</button>
      <p id="results"></p>
    </div>
  );
}

export default App;
