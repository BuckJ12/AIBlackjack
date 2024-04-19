import React, { useEffect, useState } from 'react';
import { Deck, Card } from './deck';
import './App.css';
import Bet from './components/Bet';
import Rulesbox from './components/Rulesbox';
import { motion } from 'framer-motion';

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
    <motion.div
      className={cardClass}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} // duration of the animation
    >
      <div className='card-value'>
        {card.rank} {suitSymbol}
      </div>
    </motion.div>
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
  const [nextBet, setNextBet] = useState<number>(0);
  const [bets, setBets] = useState<number[]>([]);
  const [runCount, setRunCount] = useState(0);
  const [AI, setAI] = useState('');

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
    startHand([nextBet]);
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
    startHand([bet]);
  };

  const startHand = (bet: number[] = bets) => {
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
      setWinner([]);
      setCurrentHandIndex(0);
      setPlayerHands([[playerFirstCard, playerSecondCard]]);
      setDealerHand([dealerFirstCard, dealerSecondCard]);
      setPlayerTurn(true);
      if (calculateHandValue([playerFirstCard, playerSecondCard]) === 21) {
        setPlayerTurn(false);
        dealerTurn([[playerFirstCard, playerSecondCard]]);
      } else if (
        calculateHandValue([dealerFirstCard, dealerSecondCard]) === 21
      ) {
        setPlayerTurn(false);
        determineOutcome(
          [dealerFirstCard, dealerSecondCard],
          [[playerFirstCard, playerSecondCard]],
          bet
        );
      }
    } else {
      console.error('Error dealing cards');
    }
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
      Deck.value(playerHands[handIndex][0]) ===
        Deck.value(playerHands[handIndex][1]) &&
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

      // Update Run Count Variable
      if (
        newCard.rank === '10' ||
        newCard.rank === 'J' ||
        newCard.rank === 'Q' ||
        newCard.rank === 'K' ||
        newCard.rank === 'A'
      ) {
        setRunCount(runCount - 1);
      } else if (
        newCard.rank === '2' ||
        newCard.rank === '3' ||
        newCard.rank === '4' ||
        newCard.rank === '5' ||
        newCard.rank === '6'
      ) {
        setRunCount(runCount + 1);
      }

      if (
        calculateHandValue(newHands[handIndex]) >= 21 ||
        newHands[handIndex].length >= 5
      ) {
        if (handIndex + 1 < playerHands.length) {
          setCurrentHandIndex(handIndex + 1);
          // Connect to AI and give optimal move
        } else if (calculateHandValue(newHands[handIndex]) > 21) {
          setPlayerTurn(false);
          determineOutcome(dealerHand, newHands);
        } else if (newHands[handIndex].length >= 5) {
          setPlayerTurn(false);
          dealerTurn(newHands);
        } else {
          setPlayerTurn(false);
        }
      }
      return newHands;
    }
    return playerHands;
  };

  const stand = (handIndex: number, phand: Card[][] = playerHands) => {
    if (handIndex + 1 < playerHands.length) {
      setCurrentHandIndex(handIndex + 1);
    } else {
      setPlayerTurn(false);

      dealerTurn(phand);
    }
  };

  const canDoubleDown = (handIndex: number) => {
    return (
      bets[currentHandIndex] <= money && playerHands[handIndex].length === 2
    );
  };

  const DoubleDown = (handIndex: number) => {
    const nHands = drawCard(handIndex);
    setMoney(money - bets[currentHandIndex]);
    setBets((prevBets) => {
      const newBets = [...prevBets];
      newBets[currentHandIndex] = newBets[currentHandIndex] * 2;
      return newBets;
    });
    stand(handIndex, nHands);
  };

  const dealerTurn = async (phands: Card[][] = playerHands) => {
    const tempDealerHand = [...dealerHand]; // Make a temporary copy of the dealer's hand
    let dealerHandValue = calculateHandValue(tempDealerHand);

    // Dealer hits on 16 and stands on 17
    let busts = 0;
    for (let i = 0; i < phands.length; i++) {
      if (calculateHandValue(phands[i]) > 21) {
        busts += 1;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (busts < phands.length) {
      while (dealerHandValue < 17) {
        const newCard = gameDeck.draw();
        if (!newCard) {
          console.error('Deck is empty, no more cards to draw');
          break;
        }
        tempDealerHand.push(newCard);
        setDealerHand(tempDealerHand);
        dealerHandValue = calculateHandValue(tempDealerHand);
        // Wait for a second before drawing the next card
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Now update the state once after the dealer's turn is complete
    setDealerHand(tempDealerHand);

    // And then determine the outcome
    determineOutcome(tempDealerHand, phands);
  };

  const determineOutcome = (
    dealerHand: Card[],
    playerHands: Card[][],
    pbets: number[] = bets
  ) => {
    const dealerHandValue = calculateHandValue(dealerHand);
    const outcomes = playerHands.map((playerHand, index) => {
      const playerHandValue = calculateHandValue(playerHand);

      if (
        playerHandValue === 21 &&
        playerHand.length === 2 &&
        dealerHandValue !== 21
      ) {
        setMoney(money + pbets[index] * 2.5);
        return 'Blackjack Payout ' + pbets[index] * 2.5;
      } else if (
        dealerHandValue === 21 &&
        dealerHand.length === 2 &&
        playerHandValue !== 21
      ) {
        return 'Loss - Dealer Blackjack: ' + pbets[index];
      }
      if (playerHandValue > 21) {
        return 'Loss - Player Busts Bet: ' + pbets[index];
      } else if (dealerHandValue > 21) {
        setMoney(money + pbets[index] * 2);
        return 'Win - Dealer Busts Payout ' + pbets[index] * 2;
      } else if (playerHandValue > dealerHandValue) {
        setMoney(money + pbets[index] * 2);
        return 'Win Payout ' + pbets[index] * 2;
      } else if (playerHandValue < dealerHandValue) {
        return 'Loss Bet: ' + pbets[index];
      } else {
        setMoney(money + pbets[index]);
        return 'Draw - Return Bet: ' + pbets[index];
      }
    });
    setWinner(outcomes);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then((response) => response.json())
      .then((data) => setAI(data.message))
      .catch((err) => console.error('Error fetching data: ', err));
  }, []);

  // ORDER of PREDICTION METHOD
  //cards_remaining, dealer_up, true_count, initial_sum, double

  useEffect(() => {
    const sendData = async () => {
      if (dealerHand.length > 0 && playerHands.length > currentHandIndex) {
        const cardsRemaining = gameDeck.length();
        const dealerUpCard = dealerHand[0];
        let dealerUpValue;

        // Convert card ranks to numeric values
        if (['J', 'Q', 'K'].includes(dealerUpCard.rank)) {
          dealerUpValue = 10;
        } else if (dealerUpCard.rank === 'A') {
          dealerUpValue = 11;
        } else {
          dealerUpValue = parseInt(dealerUpCard.rank, 10);
        }

        const trueCount = runCount / (cardsRemaining / 52); // Assuming 52 cards per deck in the calculation
        const currentHand = playerHands[currentHandIndex];
        const initialSum = calculateHandValue(currentHand);

        // Determine if the current hand can be split (two cards of the same rank)
        const canSplit =
          currentHand.length === 2 &&
          currentHand[0].rank === currentHand[1].rank &&
          bets[currentHandIndex] * 2 <= money &&
          playerHands.length === 1;

        // Preparing data for the request
        const requestData = {
          cards_remaining: cardsRemaining,
          dealer_up: dealerUpValue,
          true_count: trueCount,
          initial_sum: initialSum,
          double: canSplit, // Indicates possibility of splitting the hand
        };

        try {
          const response = await fetch('http://localhost:5000/api/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (response.ok) {
            const data = await response.json();
            setAI(data.prediction + ' on ' + data.message);
          } else {
            console.error('Error fetching data:', response.statusText);
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
    };

    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerHands, currentHandIndex]);

  return (
    <>
      <h2>Blackjack Game</h2>
      <h3>AI Suggestion {AI}</h3>
      <h4> True Count: {(runCount / (gameDeck.length() / 52)).toFixed(4)}</h4>

      <Rulesbox />

      {gameDeck.length() < 10 ? (
        // Game Over Screen
        <>
          <h3>Game Over: Out of Cards</h3>
          <div>SCORE: {money}</div>
          <Bet
            nextBet={nextBet}
            setNextBet={setNextBet}
            playerTurn={playerTurn}
            money={money}
            placeBet={placeBet}
            newGame={newGame}
          />
        </>
      ) : (
        <>
          <h4>Remaining Cards: {gameDeck.length()}</h4>
          <div>Money: {money}</div>
        </>
      )}
      {/* Game Screen*/}
      <>
        {dealerHand.length > 0 && (
          <div>
            <h3>Dealer Hand</h3>
            <>
              <CardComponent
                card={dealerHand[0]}
                key={`${dealerHand[0].rank}-${dealerHand[0].suit}-${dealerHand.length}`}
              />
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
                <CardComponent
                  key={`${card.rank}-${card.suit}-${cardIndex}-${hand.length}-${index}`}
                  card={card}
                />
              ))}
              <div>Hand Value: {calculateHandValue(hand)}</div>
              <div>Bet: {bets[index] || 0}</div>
              {/* Display the result for each hand here */}
              {!playerTurn && winner[index] && <p>{winner[index]}</p>}
              {/* Actions for current hand */}
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

        <Bet
          nextBet={nextBet}
          setNextBet={setNextBet}
          playerTurn={playerTurn}
          money={money}
          placeBet={placeBet}
          newGame={newGame}
        />
      </>
    </>
  );
};

export default BlackjackGame;
