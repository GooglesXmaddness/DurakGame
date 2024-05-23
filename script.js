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
        try {
            suits.forEach(suit => {
                ranks.forEach(rank => {
                    deck.push({suit, rank, image: `Flat Playing Cards Set/${rank}_of_${suit}.svg`});
                });
            });
            shuffleDeck();
        } catch (error) {
            console.error("Error in createDeck: ", error);
        }
    }

    function shuffleDeck() {
        try {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        } catch (error) {
            console.error("Error in shuffleDeck: ", error);
        }
    }

    function dealCards() {
        try {
            playerHand = deck.splice(0, 6);
            opponentHand = deck.splice(0, 6);
            trumpCard = deck[0];
            updateUI();
        } catch (error) {
            console.error("Error in dealCards: ", error);
        }
    }

    function updateUI() {
        try {
            document.getElementById('player-hand').innerHTML = playerHand.map((card, index) => `<div class="card player-card" data-index="${index}"><img src="${card.image}" alt="${card.rank} of ${card.suit}" class="card-image"></div>`).join('');
            document.getElementById('opponent-hand').innerHTML = opponentHand.map(card => `<div class="card opponent-card"><img src="Flat Playing Cards Set/back.png" alt="card back" class="card-image"></div>`).join('');
            document.getElementById('table').innerHTML = tableCards.map((card, index) => `<div class="card table-card" id="table-card-${index}"><img src="${card.image}" alt="${card.rank} of ${card.suit}" class="card-image"></div>`).join('');
            
            // Display the trump card and a single card as the deck
            document.getElementById('deck-container').innerHTML = `
                <div id="deck" class="card">
                    <img src="Flat Playing Cards Set/back.png" alt="card back" class="card-image">
                </div>
                <div id="trump-card" class="card">
                    <img src="${trumpCard.image}" alt="${trumpCard.rank} of ${trumpCard.suit}" class="card-image">
                </div>
            `;

            bindCardClickEvents();
        } catch (error) {
            console.error("Error in updateUI: ", error);
        }
    }

    function bindCardClickEvents() {
        try {
            document.querySelectorAll('.player-card').forEach(card => {
                card.addEventListener('click', function(event) {
                    const index = card.getAttribute('data-index');
                    playCard(index);
                });
            });
        } catch (error) {
            console.error("Error in bindCardClickEvents: ", error);
        }
    }

    function playCard(index) {
        try {
            if (!isPlayerTurn || tableCards.length >= 12) return;
            const playerCard = playerHand.splice(index, 1)[0];
            tableCards.push(playerCard);
            placeCardOnTable(playerCard, true);
            isPlayerTurn = false;
            botPlay();
            updateUI();
        } catch (error) {
            console.error("Error in playCard: ", error);
        }
    }

    function botPlay() {
        setTimeout(() => {
            try {
                if (tableCards.length % 2 === 0) {
                    // Bot attacks
                    const attackCard = opponentHand.pop();
                    tableCards.push(attackCard);
                    placeCardOnTable(attackCard, false);
                } else {
                    // Bot defends
                    const defendCard = opponentHand.pop();
                    tableCards.push(defendCard);
                    placeCardOnTable(defendCard, false);
                }
                isPlayerTurn = true;
                updateUI();
            } catch (error) {
                console.error("Error in botPlay: ", error);
            }
        }, 1000);
    }

    function placeCardOnTable(card, isPlayer) {
        try {
            const table = document.getElementById('table');
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.innerHTML = `<img src="${card.image}" alt="${card.rank} of ${card.suit}" class="card-image">`;
            cardDiv.style.position = 'absolute';

            const offsetX = 30; // Horizontal offset between cards
            const offsetY = 50; // Vertical offset between cards

            if (tableCards.length % 2 === 0) {
                // First card (player or opponent)
                cardDiv.style.left = `calc(50% - ${offsetX}px)`; // Centered horizontally with offset
                cardDiv.style.top = `calc(50% - ${offsetY}px)`;  // Centered vertically with offset
            } else {
                // Second card (opponent or player) - overlay on top of the first card
                cardDiv.style.left = `calc(50% - ${offsetX / 2}px)`; // Slightly offset to show both cards
                cardDiv.style.top = `calc(50% - ${offsetY / 2}px)`;  // Slightly offset to show both cards
            }

            cardDiv.style.zIndex = tableCards.length; // Ensure the latest card is on top
            cardDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Add shadow for visual distinction
            table.appendChild(cardDiv);
        } catch (error) {
            console.error("Error in placeCardOnTable: ", error);
        }
    }

    try {
        createDeck();
        dealCards();
    } catch (error) {
        console.error("Error in main execution: ", error);
    }
});
