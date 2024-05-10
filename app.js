// Deck of cards and their values
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

let deck, playerHand, dealerHand, gameActive;

// Initialize the game
function initGame() {
    deck = generateDeck();
    shuffleDeck(deck);
    playerHand = [];
    dealerHand = [];
    gameActive = true;

    // Deal initial cards
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand, true);

    updateHands();
    updateStatus("Player's turn. Choose Hit or Stand.");
}

// Generate a standard deck of cards
function generateDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    return deck;
}

// Shuffle the deck of cards
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal a card to the specified hand
function dealCard(hand, hidden = false) {
    const card = deck.pop();
    card.hidden = hidden;
    hand.push(card);
}

// Calculate the total value of a hand
function calculateHandValue(hand) {
    let total = 0;
    let aceCount = 0;

    for (const card of hand) {
        total += cardValues[card.rank];
        if (card.rank === 'A') {
            aceCount++;
        }
    }

    // Adjust for Aces being either 1 or 11
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }
    return total;
}

// Update the display for the player and dealer hands
function updateHands() {
    const playerHandEl = document.getElementById("player-hand");
    const dealerHandEl = document.getElementById("dealer-hand");

    playerHandEl.innerHTML = '';
    dealerHandEl.innerHTML = '';

    playerHand.forEach(card => {
        playerHandEl.innerHTML += cardToHTML(card);
    });

    dealerHand.forEach(card => {
        dealerHandEl.innerHTML += cardToHTML(card);
    });

    document.getElementById("status").textContent = `Player: ${calculateHandValue(playerHand)}, Dealer: ${dealerHand[0].hidden ? '?' : calculateHandValue(dealerHand)}`;
}

// Convert a card object to HTML for display
function cardToHTML(card) {
    return `<div class="card ${card.hidden ? 'hidden' : card.suit}">
        ${card.hidden ? '' : card.rank}
    </div>`;
}

// Handle the player's choice to hit
function playerHit() {
    if (!gameActive) return;

    dealCard(playerHand);
    updateHands();

    const playerTotal = calculateHandValue(playerHand);
    if (playerTotal > 21) {
        endGame("Player busts! Dealer wins.");
    }
}

// Handle the player's choice to stand
function playerStand() {
    if (!gameActive) return;

    revealDealerHand();

    while (calculateHandValue(dealerHand) < 17) {
        dealCard(dealerHand);
        updateHands();
    }

    const dealerTotal = calculateHandValue(dealerHand);
    const playerTotal = calculateHandValue(playerHand);

    if (dealerTotal > 21) {
        endGame("Dealer busts! Player wins.");
    } else if (dealerTotal > playerTotal) {
        endGame("Dealer wins!");
    } else if (dealerTotal < playerTotal) {
        endGame("Player wins!");
    } else {
        endGame("It's a tie!");
    }
}

// Reveal the dealer's hidden hand
function revealDealerHand() {
    dealerHand[0].hidden = false;
    updateHands();
}

// End the game and display the result
function endGame(resultMessage) {
    gameActive = false;
    updateStatus(resultMessage);
    document.getElementById("hit-btn").style.display = "none";
    document.getElementById("stand-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "inline";
}

// Update the status message
function updateStatus(message) {
    document.getElementById("status").textContent = message;
}

// Restart the game
function restartGame() {
    document.getElementById("hit-btn").style.display = "inline";
    document.getElementById("stand-btn").style.display = "inline";
    document.getElementById("restart-btn").style.display = "none";
    initGame();
}

// Event listeners
document.getElementById("hit-btn").addEventListener("click", playerHit);
document.getElementById("stand-btn").addEventListener("click", playerStand);
document.getElementById("restart-btn").addEventListener("click", restartGame);

// Initialize the game on page load
window.addEventListener("load", initGame);

