import React, { useState } from 'react';
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
  const [gameDeck, setGameDeck] = useState<Deck>(new Deck());
  const [playerHands, setPlayerHands] = useState<Card[][]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerTurn, setPlayerTurn] = useState<boolean>(false);
  const [winner, setWinner] = useState<string[]>([]);
  const [currentHandIndex, setCurrentHandIndex] = useState(0);

  const newGame = () => {
    const newDeck = new Deck();
    newDeck.shuffle();
    setGameDeck(new Deck());
    setPlayerHands([]);
    setDealerHand([]);
    setPlayerTurn(false);
    setWinner([]);
    setCurrentHandIndex(0);
    startGame();
  };

  const startGame = () => {
    const Deck = gameDeck;

    const playerFirstCard = Deck.draw();
    const dealerFirstCard = Deck.draw();
    const playerSecondCard = Deck.draw();
    const dealerSecondCard = Deck.draw();

    if (
      playerFirstCard &&
      dealerFirstCard &&
      playerSecondCard &&
      dealerSecondCard
    ) {
      setGameDeck(Deck);
      setPlayerHands([[playerFirstCard, playerSecondCard]]);
      setDealerHand([dealerFirstCard, dealerSecondCard]);
      setPlayerTurn(true);
      setWinner([]);
      setCurrentHandIndex(0);
      if (calculateHandValue([playerFirstCard, playerSecondCard]) === 21) {
        setPlayerTurn(false);
        dealerTurn();
      } else if (
        calculateHandValue([dealerFirstCard, dealerSecondCard]) === 21
      ) {
        setPlayerTurn(false);
        determineOutcome();
      }
    } else {
      console.error('Error dealing cards');
    }
    // Connect to AI and give optimal move
  };

  const calculateHandValue = (hand: Card[]): number => {
    let total = 0;
    let aceCount = 0;

    hand.forEach((card) => {
      if (card.rank === 'A') {
        aceCount += 1;
        total += 11;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        total += 10;
      } else {
        total += parseInt(card.rank, 10);
      }
    });

    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount -= 1;
    }

    return total;
  };

  const canSplit = (handIndex: number) => {
    return (
      playerHands[handIndex].length === 2 &&
      playerHands[handIndex][0].rank === playerHands[handIndex][1].rank &&
      playerHands.length === 1 // To simplify, only allow splitting on the first turn
    );
  };

  const splitHand = (handIndex: number) => {
    if (!canSplit(handIndex)) return;

    const handToSplit = playerHands[handIndex];
    const newHands: Card[][] = [
      [handToSplit[0], gameDeck.draw()],
      [handToSplit[1], gameDeck.draw()],
    ];

    setPlayerHands(newHands);
  };

  const drawCard = (handIndex: number) => {
    const newCard = gameDeck.draw();
    if (newCard) {
      const newHands = [...playerHands];
      newHands[handIndex] = [...newHands[handIndex], newCard];
      setPlayerHands(newHands);

      if (
        calculateHandValue(newHands[handIndex]) >= 21 ||
        newHands[handIndex].length >= 5
      ) {
        if (handIndex + 1 < playerHands.length) {
          setCurrentHandIndex(handIndex + 1);
          // Connect to AI and give optimal move
        } else {
          setPlayerTurn(false);
        }
      }
    }
  };

  const stand = (handIndex: number) => {
    if (handIndex + 1 < playerHands.length) {
      setCurrentHandIndex(handIndex + 1);
    } else {
      setPlayerTurn(false); // End the player's turn after the last hand is stood
      dealerTurn();
    }
  };

  const DoubleDown = (handIndex: number) => {
    drawCard(handIndex);
    stand(handIndex);
  };

  const dealerTurn = () => {
    let dealerHandValue = calculateHandValue(dealerHand);
    while (dealerHandValue < 17) {
      const newCard = gameDeck.draw();
      if (!newCard) {
        console.error('Deck is empty, no more cards to draw');
        break;
      }
      setDealerHand((prevHand) => [...prevHand, newCard]);
      dealerHandValue = calculateHandValue([...dealerHand, newCard]);
    }
    determineOutcome(); // After the dealer's turn, determine the game's outcome
  };

  const determineOutcome = () => {
    const dealerHandValue = calculateHandValue(dealerHand);
    const outcomes = playerHands.map((playerHand) => {
      const playerHandValue = calculateHandValue(playerHand);
      if (playerHandValue > 21) {
        return 'Loss - Player Busts';
      } else if (dealerHandValue > 21) {
        return 'Win - Dealer Busts';
      } else if (playerHandValue > dealerHandValue) {
        return 'Win';
      } else if (playerHandValue < dealerHandValue) {
        return 'Loss';
      } else {
        return 'Draw';
      }
    });
    setWinner(outcomes);
  };

  return (
    <>
      <h2>Blackjack Game</h2>
      <button onClick={newGame}>Start Game</button>

      {dealerHand.length > 0 && (
        <div>
          <h3>Dealer Hand</h3>
          {dealerHand.length > 0 && (
            <>
              <CardComponent card={dealerHand[0]} />
              {playerTurn && dealerHand.length > 1 ? (
                <div className='card back'>?</div>
              ) : (
                dealerHand
                  .slice(1)
                  .map((card, index) => (
                    <CardComponent key={index} card={card} />
                  ))
              )}
            </>
          )}
          <div>
            Dealer Hand Value:
            {playerTurn
              ? calculateHandValue([dealerHand[0]])
              : calculateHandValue(dealerHand)}
          </div>
        </div>
      )}

      <div className='hands-container'>
        {playerHands.map((hand, index) => (
          <div className='hand' key={index}>
            <h3>Player Hand {index + 1}</h3>
            {hand.map((card, cardIndex) => (
              <CardComponent key={cardIndex} card={card} />
            ))}
            <div>Hand Value: {calculateHandValue(hand)}</div>
            {currentHandIndex === index && playerTurn && (
              <>
                <button onClick={() => drawCard(index)}>Hit</button>
                <button onClick={() => stand(index)}>Stand</button>
                {canSplit(index) && (
                  <button onClick={() => splitHand(index)}>Split</button>
                )}
                {hand.length === 2 && (
                  <button onClick={() => DoubleDown(index)}>Double Down</button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {!playerTurn && (
        <div>
          {winner.map((result, index) => (
            <>
              <p key={index}>
                Hand {index + 1}: {result}
              </p>
              <button onClick={startGame}>Play Again</button>
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default BlackjackGame;
