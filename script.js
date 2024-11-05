const gameContainer = document.querySelector('.memory-game');
const restartButton = document.getElementById('restartBtn');
const cardPairs = 12; // Anzahl der Kartenpaare
const cards = [];

for (let i = 1; i <= cardPairs; i++) {
    cards.push({ id: i, src: `gfx/${i}.png` });
}

const memoryCards = cards.concat(cards).sort(() => 0.5 - Math.random());

memoryCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    cardElement.dataset.framework = card.id;

    const frontFace = document.createElement('img');
    frontFace.classList.add('front-face');
    frontFace.src = card.src;
    frontFace.alt = `Karte ${card.id}`;

    const backFace = document.createElement('img');
    backFace.classList.add('back-face');
    backFace.src = 'gfx/back.png';
    backFace.alt = 'Rückseite';

    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);

    gameContainer.appendChild(cardElement);
});

const cardsInGame = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    checkGameOver();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function checkGameOver() {
    const flippedCards = document.querySelectorAll('.flip');
    if (flippedCards.length === memoryCards.length) {
        setTimeout(() => {
            restartButton.classList.remove('hidden');
        }, 6000);
    }
}

function restartGame() {
    cardsInGame.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });

    restartButton.classList.add('hidden');
}

cardsInGame.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', restartGame);

// Initialer Aufruf, um zu überprüfen, ob das Spiel beim Laden der Seite beendet ist
checkGameOver();
