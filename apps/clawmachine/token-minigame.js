document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addTokensBtn = document.getElementById('btn-add-tokens');
    const tokenCountEl = document.getElementById('token-count');
    const modal = document.getElementById('token-game-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const startGameBtn = document.getElementById('start-minigame-btn');
    const gameArea = document.getElementById('minigame-area');
    const timerDisplay = document.getElementById('minigame-timer');
    const scoreDisplay = document.getElementById('minigame-score');
    const resultContainer = document.getElementById('minigame-result');
    const earnedTokensDisplay = document.getElementById('earned-tokens-count');
    const claimTokensBtn = document.getElementById('claim-tokens-btn');

    let currentTokens = parseInt(tokenCountEl.textContent, 10) || 5;
    let score = 0;
    let timeLeft = 10;
    let timerInterval = null;

    // Open Modal
    addTokensBtn.addEventListener('click', () => {
        resetGameUI();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    // Close Modal
    closeModalBtn.addEventListener('click', closeModal);

    function closeModal() {
        clearInterval(timerInterval);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    // Start Mini-Game
    startGameBtn.addEventListener('click', startMiniGame);

    function startMiniGame() {
        score = 0;
        timeLeft = 10;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;

        startGameBtn.classList.add('hidden');
        resultContainer.classList.add('hidden');
        gameArea.innerHTML = '';

        spawnCoin();

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endMiniGame();
            }
        }, 1000);
    }

    function spawnCoin() {
        gameArea.innerHTML = '';

        const coin = document.createElement('div');
        coin.className = 'absolute cursor-pointer text-4xl select-none transform hover:scale-125 active:scale-90 transition-transform duration-100 animate-bounce';
        coin.textContent = '🪙';

        // Calculate random position inside game area
        const areaWidth = gameArea.clientWidth - 60;
        const areaHeight = gameArea.clientHeight - 60;
        const randomX = Math.max(10, Math.floor(Math.random() * areaWidth));
        const randomY = Math.max(10, Math.floor(Math.random() * areaHeight));

        coin.style.left = `${randomX}px`;
        coin.style.top = `${randomY}px`;

        coin.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            score++;
            scoreDisplay.textContent = score;
            spawnCoin();
        });

        gameArea.appendChild(coin);
    }

    function endMiniGame() {
        clearInterval(timerInterval);
        gameArea.innerHTML = '';

        resultContainer.classList.remove('hidden');
        earnedTokensDisplay.textContent = score;

        if (typeof confetti === 'function' && score > 0) {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    claimTokensBtn.addEventListener('click', () => {
        currentTokens += score;
        tokenCountEl.textContent = currentTokens;
        closeModal();
    });

    function resetGameUI() {
        score = 0;
        timeLeft = 10;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        gameArea.innerHTML = '<p class="text-gray-500 font-bold brand-font text-center mt-20">Click "Start Game" to catch as many tokens as you can!</p>';
        startGameBtn.classList.remove('hidden');
        resultContainer.classList.add('hidden');
    }
});