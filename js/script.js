// VIA UNIVERSITY COLLEGE - WEB1GROUP7ASSIGNMENT3
// game stats
let playerScore = 0;
let computerScore = 0;
let playerLives = 3;
let computerLives = 3;
let gameOver = false;

// stats variables
let gamesPlayed = 0;
let wins = 0;
let losses = 0;
let winPercentage = 0;

//dom elements
const playerScoreDisplay = document.querySelector('.points-left');
const computerScoreDisplay = document.querySelector('.points-right');
const resultMessage = document.getElementById('resultMessage');
const resetButton = document.getElementById('resetBtn');
const choiceImages = document.querySelectorAll('.table-images img');
const playerHearts = document.querySelectorAll('.heart-imgLeft');
const computerHearts = document.querySelectorAll('.heart-imgRight');
const leftHand = document.querySelector('.left-hand');
const rightHand = document.querySelector('.right-hand');

// stats elements
const gamesPlayedDisplay = document.querySelector('.gameplayed');
const winsDisplay = document.querySelector('.win');
const lossesDisplay = document.querySelector('.lose');
const winPercentageDisplay = document.querySelector('.winp');
const resetstats = document.querySelector('.statsreset');

//initialize game
function initGame() {
    playerScore = 0;
    computerScore = 0;
    playerLives = 3;
    computerLives = 3;
    gameOver = false;
    
    updateScoreDisplay();
    updateHeartDisplay();
    resultMessage.textContent = "Choose your weapon!";
    
    // Reset hand images
    leftHand.src = "images/green.png";
    rightHand.src = "images/green.png";
    
    // Enable all choices
    choiceImages.forEach(img => {
        img.style.opacity = "1";
        img.style.cursor = "pointer";
    });
    
    // Load stats
    loadStats();
}

// Load stats from localStorage
function loadStats() {
    const savedStats = localStorage.getItem('rpsStats');
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        gamesPlayed = stats.gamesPlayed || 0;
        wins = stats.wins || 0;
        losses = stats.losses || 0;
        winPercentage = stats.winPercentage || 0;
    }
    updateStatsDisplay();
}

// Save stats to localStorage
function saveStats() {
    const stats = {
        gamesPlayed: gamesPlayed,
        wins: wins,
        losses: losses,
        winPercentage: winPercentage
    };
    localStorage.setItem('rpsStats', JSON.stringify(stats));
}

// Update stats display
function updateStatsDisplay() {
    gamesPlayedDisplay.textContent = `Game played: ${gamesPlayed}`;
    winsDisplay.textContent = `Win: ${wins}`;
    lossesDisplay.textContent = `Lose: ${losses}`;
    winPercentageDisplay.textContent = `Win %: ${winPercentage}`;
}

// Update stats
function updateStats(result) {
    gamesPlayed++;
    
    if (result === 'player') {
        wins++;
    } else if (result === 'computer') {
        losses++;
    }
    
    winPercentage = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
    
    saveStats();
    updateStatsDisplay();
}

// Update score display
function updateScoreDisplay() {
    playerScoreDisplay.textContent = `Player: ${playerScore}`;
    computerScoreDisplay.textContent = `Computer: ${computerScore}`;
}

// Update heart display
function updateHeartDisplay() {
    playerHearts.forEach((heart, index) => {
        if (index < playerLives) {
            heart.style.display = "block";
        } else {
            heart.style.display = "none";
        }
    });
    computerHearts.forEach((heart, index) => {
        if (index < computerLives) {
            heart.style.display = "block";
        } else {
            heart.style.display = "none";
        }
    });
}

// Get computer choice
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

// Determine winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'player';
    } else {
        return 'computer';
    }
}

// Handle player choice
function handlePlayerChoice(event) {
    if (gameOver) return;
    
    const playerChoice = event.target.classList[0].replace('-img', '');
    const computerChoice = getComputerChoice();
    

    leftHand.src = `images/${playerChoice}white.png`;
    rightHand.src = `images/${computerChoice}black.png`;
    
    const winner = determineWinner(playerChoice, computerChoice);
    
    // Display result
    let message = '';
    if (winner === 'player') {
        message = `You win! ${playerChoice} beats ${computerChoice}`;
        computerLives--;
        updateHeartDisplay();
    } else if (winner === 'computer') {
        message = `You lose! ${computerChoice} beats ${playerChoice}`;
        playerLives--;
        updateHeartDisplay();
    } else {
        message = `It's a tie! Both chose ${playerChoice}`;
    }
    
    resultMessage.textContent = message;
    updateScoreDisplay();
    checkGameOver();
}

// Check if game is over
function checkGameOver() {
    if (computerLives == 0) {
        playerScore++;
        updateScoreDisplay();
        playerLives = 3;
        computerLives = 3;
        updateHeartDisplay();
        
        if (playerScore >= 3) {
            updateStats('player');
            endGame('player');
        } else {
            resultMessage.textContent = "You won this round! Next round starting...";
            setTimeout(() => {
                resultMessage.textContent = "Choose your weapon!";
                leftHand.src = "images/green.png";
                rightHand.src = "images/green.png";
            }, 800);
        }
    } else if (playerLives == 0) {
        computerScore++;
        updateScoreDisplay();
        playerLives = 3;
        computerLives = 3;
        updateHeartDisplay();
        
        if (computerScore >= 3) {
            updateStats('computer');
            endGame('computer');
        } else {
            resultMessage.textContent = "Computer won this round! Next round starting...";
            setTimeout(() => {
                resultMessage.textContent = "Choose your weapon!";
                leftHand.src = "images/green.png";
                rightHand.src = "images/green.png";
            }, 800);
        }
    }
}

// End game
function endGame(winner) {
    gameOver = true;
    
    if (winner === 'player') {
        resultMessage.textContent = "You won the game!";
    } else {
        resultMessage.textContent = "Game Over!You lost!";
    }
    
    // Disable choices
    choiceImages.forEach(img => {
        img.style.opacity = "0.5";
        img.style.cursor = "default";
    });
}

// Event listeners
choiceImages.forEach(img => {
    img.addEventListener('click', handlePlayerChoice);
});

resetButton.addEventListener('click', initGame);

resetstats.addEventListener("click",function(){
    gamesPlayed = 0;
    wins = 0;
    losses = 0;
    winPercentage = 0;
    saveStats();
    updateStatsDisplay();
})

// Initialize game

initGame();

