// VIA UNIVERSITY COLLEGE - WEB1GROUP7ASSIGNMENT3
// Game start
const gameState = {
  playerScore: 0,
  computerScore: 0,
  playerLives: 3,
  computerLives: 3,
  gameOver: false,
  stats: {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    winPercentage: 0
  }
};

// DOM
const DOM = {
  playerScore: document.querySelector('.points-left'),
  computerScore: document.querySelector('.points-right'),
  resultMessage: document.getElementById('resultMessage'),
  resetBtn: document.getElementById('resetBtn'),
  choiceImages: document.querySelectorAll('.table-images img'),
  playerHearts: document.querySelectorAll('.heart-imgLeft'),
  computerHearts: document.querySelectorAll('.heart-imgRight'),
  leftHand: document.querySelector('.left-hand'),
  rightHand: document.querySelector('.right-hand'),
  stats: {
    gamesPlayed: document.querySelector('.gameplayed'),
    wins: document.querySelector('.win'),
    losses: document.querySelector('.lose'),
    winPercentage: document.querySelector('.winp'),
    resetStats: document.querySelector('.statsreset')
  }
};
 DOM.resultMessage.textContent = "Choose your hand";
const rules = { rock: "scissors", paper: "rock", scissors: "paper" };

//function
function updateScores() {
  DOM.playerScore.textContent = `Player: ${gameState.playerScore}`;
  DOM.computerScore.textContent = `Computer: ${gameState.computerScore}`;
}

function updateHearts() {
  DOM.playerHearts.forEach((heart, i) => heart.style.display = i < gameState.playerLives ? "block" : "none");
  DOM.computerHearts.forEach((heart, i) => heart.style.display = i < gameState.computerLives ? "block" : "none");
}

function updateStatsDisplay() {
  const s = gameState.stats;
  DOM.stats.gamesPlayed.textContent = `Game played: ${s.gamesPlayed}`;
  DOM.stats.wins.textContent = `Win: ${s.wins}`;
  DOM.stats.losses.textContent = `Lose: ${s.losses}`;
  DOM.stats.winPercentage.textContent = `Win %: ${s.winPercentage}`;
}

function saveStats() { localStorage.setItem('rpsStats', JSON.stringify(gameState.stats)); }
function loadStats() {
  const saved = JSON.parse(localStorage.getItem('rpsStats'));
  if (saved) gameState.stats = saved;
  updateStatsDisplay();
}

// Game played
function getComputerChoice() {
  return Object.keys(rules)[Math.floor(Math.random() * 3)];
}

function determineWinner(player, computer) {
  if (player === computer) return 'tie';
  return rules[player] === computer ? 'player' : 'computer';
}

function updateGameStats(winner) {
  const stats = gameState.stats;
  stats.gamesPlayed++;
  if (winner === 'player') stats.wins++;
  else if (winner === 'computer') stats.losses++;
  stats.winPercentage = Math.round((stats.wins / stats.gamesPlayed) * 100);
  saveStats();
  updateStatsDisplay();
}

function setHands(player, computer) {
  DOM.leftHand.src = `images/${player}white.png`;
  DOM.rightHand.src = `images/${computer}black.png`;
}

function resetHands() {
  DOM.leftHand.src = "images/green.png";
  DOM.rightHand.src = "images/green.png";
}

function endGame(winner) {
  gameState.gameOver = true;
  DOM.resultMessage.textContent = winner === 'player' ? "You won the game!" : "Game Over! You lost!";
  DOM.choiceImages.forEach(img => { img.style.opacity = "0.5"; img.style.cursor = "default"; });
}

function handleRoundEnd() {
  gameState.playerLives = 3;
  gameState.computerLives = 3;
  updateHearts();
  resetHands();
  if (gameState.playerScore >= 3) return endGame('player');
  if (gameState.computerScore >= 3) return endGame('computer');
}

function handlePlayerChoice(e) {
  if (gameState.gameOver) return;

  const playerChoice = e.target.classList[0].replace('-img', '');
  const computerChoice = getComputerChoice();
  setHands(playerChoice, computerChoice);

  const winner = determineWinner(playerChoice, computerChoice);
  let message = '';
  if (winner === 'player') { gameState.computerLives--; }
  else if (winner === 'computer') { gameState.playerLives--; }

  updateHearts();

  // Check if lives reached 0
  if (gameState.playerLives === 0) { gameState.computerScore++; updateScores(); updateGameStats('computer'); handleRoundEnd(); }
  if (gameState.computerLives === 0) { gameState.playerScore++; updateScores(); updateGameStats('player'); handleRoundEnd(); }
}


function initGame() {
  gameState.playerScore = 0;
  gameState.computerScore = 0;
  gameState.playerLives = 3;
  gameState.computerLives = 3;
  gameState.gameOver = false;
  updateScores();
  updateHearts();
  resetHands();
  DOM.choiceImages.forEach(img => { img.style.opacity = "1"; img.style.cursor = "pointer"; });
  loadStats();
}

DOM.choiceImages.forEach(img => img.addEventListener('click', handlePlayerChoice));
DOM.resetBtn.addEventListener('click', initGame);
DOM.stats.resetStats.addEventListener('click', () => {
  gameState.stats = { gamesPlayed:0, wins:0, losses:0, winPercentage:0 };
  saveStats(); updateStatsDisplay();
});

initGame();
