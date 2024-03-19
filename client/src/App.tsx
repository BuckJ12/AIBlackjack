import React, { useEffect, useState } from 'react';
import { Deck, Card } from './deck';
import './App.css';

const cardSuitToSymbol = (suit: string): string => {
  switch (suit) {
    case 'Hearts':
      return '♥';
    case 'Diamonds':
      return '♦';
    case 'Clubs':
      return '♣';
    case 'Spades':
      return '♠';
    default:
      return 'No Suit';
  }
};

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  const suitSymbol = cardSuitToSymbol(card.suit);
  const cardClass = `card ${card.suit.toLowerCase()}`;
  return (
    <div className={cardClass}>
      <div className='card-value'>
        {card.rank} {suitSymbol}
      </div>
    </div>
  );
};

const BlackjackGame = () => {
  const [gameDeck, setgameDeck] = useState<Deck>(new Deck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerTurn, setplayerTurn] = useState<boolean>(false);
  const [playerHandValue, setplayerHandValue] = useState(0);
  const [dealerHandValue, setdealerHandValue] = useState(0);

  const startGame = () => {
    const newDeck = new Deck(); // Create a new deck for the game
    newDeck.shuffle(); // Ensure the deck is shuffled before dealing

    // Alternate dealing cards to player and dealer
    const playerFirstCard = newDeck.draw();
    const dealerFirstCard = newDeck.draw();
    const playerSecondCard = newDeck.draw();
    const dealerSecondCard = newDeck.draw();

    // Check that all cards were successfully drawn before setting state
    if (
      playerFirstCard &&
      dealerFirstCard &&
      playerSecondCard &&
      dealerSecondCard
    ) {
      setgameDeck(newDeck);
      setPlayerHand([playerFirstCard, playerSecondCard]);
      setDealerHand([dealerFirstCard, dealerSecondCard]);
      setplayerTurn(true); // Start with the player's turn
      // No need to set playerHandValue here, useEffect will handle it
    } else {
      // Handle the case where not enough cards could be drawn, if necessary
      console.error('Error dealing cards');
    }
  };

  useEffect(() => {
    const currentHandValue = calculateHandValue(playerHand);
    setplayerHandValue(currentHandValue);
    if (currentHandValue > 21) {
      setplayerTurn(false);
      console.log('Player Busts');
    } else if (currentHandValue === 21 && playerHand.length === 2) {
      console.log('Player Has BlackJack');
      setplayerTurn(false);
    }
  }, [playerHand]);

  useEffect(() => {
    const currentHandValue = calculateHandValue(dealerHand);
    setdealerHandValue(currentHandValue);
    if (currentHandValue > 21) {
      console.log('Dealer Busts');
    } else if (currentHandValue === 21 && dealerHand.length === 2) {
      console.log('Dealer Has BlackJack');
      setplayerTurn(false);
    }
  }, [dealerHand]);

  const calculateHandValue = (hand: Card[]): number => {
    let total = 0;
    let aceCount = 0;

    hand.forEach((card) => {
      if (card.rank === 'A') {
        aceCount += 1;
        total += 11; // Initially count all Aces as 11
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        total += 10;
      } else {
        total += parseInt(card.rank, 10); // Convert number cards directly to their numeric value
      }
    });

    // Adjust for Aces if total value exceeds 21
    while (total > 21 && aceCount > 0) {
      total -= 10; // Change one Ace from 11 to 1
      aceCount -= 1;
    }

    return total;
  };

  const drawplayerCard = () => {
    const newCard = gameDeck.draw();
    if (newCard) {
      setPlayerHand((prevHand) => [...prevHand, newCard]);
    }
  };

  const stand = () => {
    setplayerTurn(false); // Player ends their turn by standing

    // Function to let the dealer draw cards until their hand value is 17 or more
    const dealerDraws = () => {
      let dealerHandValue = calculateHandValue(dealerHand);
      while (dealerHandValue <= 17) {
        const newCard = gameDeck.draw();
        if (newCard) {
          setDealerHand((prevHand) => [...prevHand, newCard]);
          dealerHandValue = calculateHandValue([...dealerHand, newCard]);
        } else {
          // Handle the case where the deck is empty, if necessary
          console.error('Deck is empty, no more cards to draw');
          break;
        }
      }
    };

    dealerDraws(); // Call the function to let the dealer draw cards
  };

  return (
    <>
      <div>
        <h2>Blackjack Game</h2>
        <button onClick={startGame}>Start Game</button>
        <br /> Dealer Hand <br />
        <div className='hand dealer-hand'>
          {dealerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
        </div>
        <div key={dealerHand.length}> DealerHand Value {dealerHandValue}</div>
        <div className='hand player-hand'>
          Player Hand <br />
          {playerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
          <br />
          <div key={playerHand.length}> PlayerHand Value {playerHandValue}</div>
        </div>
      </div>
      <div>
        <>
          {playerTurn ? (
            // When playerTurn is true, show Hit and Stand buttons
            <>
              <button onClick={drawplayerCard}>Hit</button>
              <button onClick={stand}>Stand</button>
            </>
          ) : (
            // When playerTurn is false, show different elements
            // For example, show a message or actions for the dealer's turn
            <div>
              <p>Waiting for dealer...</p>
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default BlackjackGame;
