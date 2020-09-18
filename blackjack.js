const SUITS = ["C", "D", "H", "S"];
const RANKS_TO_VALUES = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "T": 10,
  "J": 10,
  "Q": 10,
  "K": 10,
  "A": 11,
};

let deck;
let playerCards;
let dealerCards;


/** Shuffle array items in-place and return shuffled array. */

function shuffleDeck() {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = deck.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

/** Fill deck with 52 objects: each like "2C" or "TS" */

function setupDeck() {
  deck = [];

  for (let suit of SUITS) {
    for (let rank of Object.keys(RANKS_TO_VALUES)) {
      deck.push(rank + suit);
    }
  }
}

/** Evaluate hand of cards and return score. */

function evaluateHand(cards) {
  let score = 0;
  let ace = 0;

  for (let card of cards) {
    if (card[0] === "A") {
      ace += 1;
      score += 11;
    }
    else if (card[0] === "T" || card[0] === "Q" || card[0] === "J" || card[0] === "K"){ 
      score += 10;
    }
    else score += parseInt(card[0]);

    // if (score > 21 && cards.some(card => card[0] === "A" ? true : false)) {
      //   score -= 10;
      // }
    }

    if (ace >= 1 && score > 21) {
      score -= 10;
      ace = 0;
    }

    return score;
  }

console.assert(evaluateHand(["9H", "8D"]) === 17);
console.assert(evaluateHand(["9H", "8D", "5S"]) === 22);
console.assert(evaluateHand(["KS", "AH"]) === 21);

/** Create and return a <div> of the card. */

function getCardImage(card) {
  let img = document.createElement("img");
  img.src = `card_images/${card}.png`;
  return img;
}

// handle new game with same deck
function newGame() {
  document.getElementById("dealer-hand-area").innerHTML = '';
  document.getElementById("player-hand-area").innerHTML = '';
  document.getElementById("restart").remove();
  document.getElementById("message-area").innerText = "(Dealer must stand on 17)";
  document.getElementById("hit").addEventListener("click", handleHit);
  document.getElementById("stand").addEventListener("click", handleStand);


  //check if shuffle needed
  if (deck.length < 15) {
    setupDeck();
    shuffleDeck();
    alert("reshuffling!");
  }
  console.log("deck left: ", deck.length);

  // re-deal
  dealerCards = [];
  drawAndShowDealerCard();

  playerCards = [];
  drawAndShowPlayerCard();
  drawAndShowPlayerCard();

  //check for blackjack
  if (evaluateHand(playerCards) === 21) {
    endHand("Blackjack!");
  }

  console.log("player: ", evaluateHand(playerCards), "dealer: ", evaluateHand(dealerCards));

}
/** Show scoring message and remove buttons to prevent further play. */

function endHand(msg) {
  console.log("player: ", evaluateHand(playerCards), "dealer: ", evaluateHand(dealerCards));
  //document.getElementById("player-buttons").remove();
  document.getElementById("hit").removeEventListener("click", handleHit);
  document.getElementById("stand").removeEventListener("click", handleStand);
  document.getElementById("message-area").innerText = msg;

  let restart = document.createElement("button");
  restart.innerText = "Restart";
  restart.setAttribute("id", "restart", "type", "button");
  document.getElementById("restart-button").appendChild(restart);

  
  restart.addEventListener("click", newGame)
}

/** Handle a player hitting. */

function handleHit() {
  drawAndShowPlayerCard();

  // check for bust
  if (evaluateHand(playerCards) > 21) {
    endHand("Bust!");
  }
  console.log("player: ", evaluateHand(playerCards));
}

/** Handle a player standing.
 *
 * - Dealer now plays
 * - Evaluate player and dealer hands
 * - End hand, showing message showing outcomes
 */

function handleStand() {
  dealerPlay();
  
  // evaluate final scores
  if (evaluateHand(dealerCards) > 21) {
    endHand("You Win!")
  }
  else if (evaluateHand(dealerCards) > evaluateHand(playerCards)) {
    endHand("You Lose!");
  }
  else if (evaluateHand(dealerCards) < evaluateHand(playerCards)) {
    endHand("You Win!");
  }
  else {
    endHand("Push");
  }
}

/** Dealer plays: draws additional cards until reaching DEALER_STANDS_ON. */

function dealerPlay() {
  while (evaluateHand(dealerCards) < 17) {
    drawAndShowDealerCard();
  }
}

/** Draw card fpr player, add to their hand, and show it. */

function drawAndShowPlayerCard() {
  let card = deck.pop();
  playerCards.push(card);
  document.getElementById("player-hand-area").append(getCardImage(card));
}

/** Draw card for dealer, add it to their hand, and show it. */

function drawAndShowDealerCard() {
  let card = deck.pop();
  dealerCards.push(card);
  document.getElementById("dealer-hand-area").append(getCardImage(card));
}

/** Start game: prepare deck, deal one card to dealer and two to player.
 *
 *  If player gets blackjack (first two cards = 21); end hand as a win.
 **/

function startGame() {
  // empty deck, fill it with cards, and shuffle it
  deck = [];
  setupDeck();
  shuffleDeck();

  dealerCards = [];
  drawAndShowDealerCard();

  playerCards = [];
  drawAndShowPlayerCard();
  drawAndShowPlayerCard();

  //check for blackjack
  if (evaluateHand(playerCards) === 21) {
    endHand("Blackjack!");
  }
  console.log("player: ", evaluateHand(playerCards), "dealer: ", evaluateHand(dealerCards));
}


// when page loads:

document.getElementById("hit").addEventListener("click", handleHit);
document.getElementById("stand").addEventListener("click", handleStand);

startGame();
