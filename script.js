document.addEventListener("DOMContentLoaded", function() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    let deck = [];
    let playerHand = [];
    let opponentHand = [];
    let tableCards = [];
    let trumpCard = '';
    let isPlayerTurn = true; // Player starts

    function createDeck() {
        suits.forEach(suit => {
            ranks.forEach(rank => {
                deck.push({suit, rank, image: `Flat Playing Cards Set/${rank}_of_${suit}.svg`});
            });
        });
        shuffleDeck();
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCards() {
        playerHand = deck.splice(0, 6);
        opponentHand = deck.splice(0, 6);
        trumpCard = deck[0];
        updateUI();
    }

    function updateUI() {
        document.getElementById('player-hand').innerHTML = playerHand.map((card, index) => `<div class="card player-card" data-index="${index}"><img src="${card.image}" alt="${card.rank} of ${card.suit}" class="card-image"></div>`).join('');
        document.getElementById('opponent-hand').innerHTML = opponentHand.map(() => `<div class="card opponent-card"><img src="Flat Playing Cards Set/back.png" alt="Card back" class="card-image"></div>`).join('');
        document.getElementById('table').innerHTML = tableCards.map((card, index) => `<div class="card table-card" id="table-card-${index}"><img src="${card.image}" alt="${card.rank} of ${card.suit}" class="card-image"></div>`).join('');
        document.getElementById('trump-card').querySelector('img').src = trumpCard.image;

        bindCardClickEvents();
    }

    function bindCardClickEvents() {
        document.querySelectorAll('.player-card').forEach(card => {
            card.addEventListener('click', function() {
                const index = card.getAttribute('data-index');
                playCard(index);
            });
        });
    }

    function playCard(index) {
        if (!isPlayerTurn || tableCards.length >= 12) return;
        const playerCard = playerHand.splice(index, 1)[0];
        tableCards.push(playerCard);
        placeCardOnTable(playerCard, true);
        isPlayerTurn = false;
        botPlay();
        updateUI();
    }

    function botPlay() {
        setTimeout(() => {
            if (tableCards.length % 2 === 0) {
                const attackCard = opponentHand.pop();
                tableCards.push(attackCard);
                placeCardOnTable(attackCard, false);
            } else {
                const defendCard = opponentHand.pop();
                tableCards.push(defendCard);
                placeCardOnTable(defendCard, false);
            }
            isPlayerTurn = true;
            updateUI();
        }, 1000);
    }

    function placeCardOnTable(card, isPlayer) {
        const table = document.getElementById('table');
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `<img src="${card.image}" alt="${card.rank} of ${card.suit}" class="card-image">`;
        cardDiv.style.position = 'absolute';
        cardDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Add shadow for visual distinction

        const offsetX = 30; // Horizontal offset between cards
        const offsetY = 50; // Vertical offset between cards

        if (tableCards.length % 2 === 0) {
            // Place the first card of a new round in the center
            cardDiv.style.left = `calc(50% - ${offsetX}px)`;
            cardDiv.style.top = `calc(50% - ${offsetY}px)`;
        } else {
            // Place the second card of a round on top of the first card
            const firstCard = table.querySelector('.card');
            const firstCardRect = firstCard.getBoundingClientRect();
            cardDiv.style.left = `${firstCardRect.left + offsetX / 2}px`;
            cardDiv.style.top = `${firstCardRect.top + offsetY / 2}px`;
        }

        cardDiv.style.zIndex = tableCards.length; // Ensure the latest card is on top
        table.appendChild(cardDiv);
    }

    createDeck();
    dealCards();
});
