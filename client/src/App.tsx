import React, { useState } from 'react';
import { Deck, Card } from './deck';
import './App.css';

const backCard: Card = {
  suit: 'Joker',
  rank: '?',
};

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
    case 'Joker':
      return '?';
    default:
      return '';
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
  const [money, setMoney] = useState(1000);
  const [nextBet, setNextBet] = useState<number>(-1);
  const [bets, setBets] = useState<number[]>([]);

  const newGame = () => {
    const newDeck = new Deck();
    newDeck.shuffle();
    setGameDeck(newDeck);
    setPlayerHands([]);
    setDealerHand([]);
    setPlayerTurn(false);
    setWinner([]);
    setCurrentHandIndex(0);
    setMoney(1000);
    startHand();
  };

  const placeBet = (bet: number) => {
    // Check if the bet is a number
    if (isNaN(bet)) {
      alert('Please enter a valid number for your bet');
      return;
    }

    // Check if the bet is greater than 0
    if (bet <= 0) {
      alert('Your bet should be more than 0');
      return;
    }

    // Check if the player has enough money to place the bet
    if (bet > money) {
      alert("You don't have enough money to place that bet!");
      return;
    }

    // Subtract the bet from the player's money and start the game
    setBets([bet]);
    setMoney(money - bet);
    startHand();
  };

  const startHand = () => {
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
        determineOutcome(
          [dealerFirstCard, dealerSecondCard],
          [[playerFirstCard, playerSecondCard]]
        );
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
      playerHands.length === 1 &&
      bets[handIndex] * 2 <= money
    );
  };

  const splitHand = (handIndex: number) => {
    if (!canSplit(handIndex)) return;
    const currbet = bets[handIndex];
    const handToSplit = playerHands[handIndex];
    const newHands: Card[][] = [
      [handToSplit[0], gameDeck.draw()],
      [handToSplit[1], gameDeck.draw()],
    ];
    setBets((prevBets) => {
      const newBets = [...prevBets];
      newBets[handIndex + 1] = currbet;
      return newBets;
    });
    setMoney(money - currbet);
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
        } else if (newHands[handIndex].length >= 5) {
          setPlayerTurn(false);
          dealerTurn();
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
      console.log('Player stands');
      dealerTurn();
    }
  };

  const canDoubleDown = (handIndex: number) => {
    return (
      bets[currentHandIndex] <= money && playerHands[handIndex].length === 2
    );
  };

  const DoubleDown = (handIndex: number) => {
    drawCard(handIndex);
    setMoney(money - bets[currentHandIndex]);
    setBets((prevBets) => {
      const newBets = [...prevBets];
      newBets[currentHandIndex] = newBets[currentHandIndex] * 2;
      return newBets;
    });
    stand(handIndex);
  };

  const dealerTurn = () => {
    const tempDealerHand = [...dealerHand]; // Make a temporary copy of the dealer's hand
    let dealerHandValue = calculateHandValue(tempDealerHand);

    while (dealerHandValue < 17) {
      const newCard = gameDeck.draw();
      if (!newCard) {
        console.error('Deck is empty, no more cards to draw');
        break;
      }
      tempDealerHand.push(newCard);
      dealerHandValue = calculateHandValue(tempDealerHand);
    }

    // Now update the state once after the dealer's turn is complete
    setDealerHand(tempDealerHand);

    // And then determine the outcome
    determineOutcome(tempDealerHand, playerHands);
  };

  const determineOutcome = (dealerHand: Card[], playerHands: Card[][]) => {
    const dealerHandValue = calculateHandValue(dealerHand);
    const outcomes = playerHands.map((playerHand, index) => {
      const playerHandValue = calculateHandValue(playerHand);
      console.log(playerHandValue, dealerHandValue);
      if (
        playerHandValue === 21 &&
        playerHand.length === 2 &&
        dealerHandValue !== 21
      ) {
        setMoney(money + bets[index] * 2.5);
        return 'Blackjack';
      } else if (
        dealerHandValue === 21 &&
        dealerHand.length === 2 &&
        playerHandValue !== 21
      ) {
        return 'Loss - Dealer Blackjack';
      }
      if (playerHandValue > 21) {
        return 'Loss - Player Busts';
      } else if (dealerHandValue > 21) {
        setMoney(money + bets[index] * 2);
        return 'Win - Dealer Busts';
      } else if (playerHandValue > dealerHandValue) {
        setMoney(money + bets[index] * 2);
        return 'Win';
      } else if (playerHandValue < dealerHandValue) {
        return 'Loss';
      } else {
        setMoney(money + bets[index]);
        return 'Draw';
      }
    });
    setWinner(outcomes);
  };

  return (
    <>
      <h2>Blackjack Game</h2>
      {gameDeck.length() < 10 ? (
        // Game Over Screen
        <>
          <h3>Game Over: Out of Cards</h3>
          <div>SCORE: {money}</div>
          <button onClick={newGame}>New Game</button>
        </>
      ) : (
        <>
          <h4>Remaining Cards: {gameDeck.length()}</h4>
          <div>Money: {money}</div>
        </>
      )}
      {/* Game Screen*/}
      <>
        {nextBet == -1 && (
          <>
            <h3>Rules:</h3>
            <ul>
              <li>Dealer hits on 16 and stands on 17</li>
              <li>Blackjack pays 2.5x your bet</li>
              <li>Win pays 2x your bet</li>
              <li>Draw returns your bet</li>
            </ul>
          </>
        )}

        {dealerHand.length > 0 && (
          <div>
            <h3>Dealer Hand</h3>
            <>
              <CardComponent card={dealerHand[0]} />
              {playerTurn && dealerHand.length > 1 ? (
                <CardComponent card={backCard} />
              ) : (
                dealerHand
                  .slice(1)
                  .map((card, index) => (
                    <CardComponent key={index} card={card} />
                  ))
              )}
            </>
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
              <div>Bet: {bets[index] || 0}</div>
              {!playerTurn && (
                <div>
                  {winner.map((result, winIndex) => (
                    <React.Fragment key={winIndex}>
                      <p>
                        Hand {winIndex + 1}: {result}
                      </p>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {currentHandIndex === index && playerTurn && (
                <>
                  <button onClick={() => drawCard(index)}>Hit</button>
                  <button onClick={() => stand(index)}>Stand</button>
                  {canSplit(index) && (
                    <button onClick={() => splitHand(index)}>Split</button>
                  )}
                  {canDoubleDown(index) && (
                    <button onClick={() => DoubleDown(index)}>
                      Double Down
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {money <= 0 && !playerTurn ? (
          <div>Game Over. You ran out of money.</div>
        ) : (
          <>
            {!playerTurn && (
              <div>
                <input
                  type='number'
                  value={nextBet}
                  onChange={(e) => {
                    setNextBet(parseInt(e.target.value));
                  }}
                  min='0'
                />
                <button onClick={() => placeBet(nextBet)}>
                  Place Next Bet
                </button>
              </div>
            )}
          </>
        )}
      </>
    </>
  );
};

export default BlackjackGame;
