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
	const [gameDeck, setgameDeck] = useState<Deck>(new Deck());
	const [playerHand, setPlayerHand] = useState<Card[]>([]);
	const [dealerHand, setDealerHand] = useState<Card[]>([]);
	const [playerTurn, setplayerTurn] = useState<boolean>(false);
	const [playerHandValue, setplayerHandValue] = useState(Number);

	const startGame = () => {
		setgameDeck(new Deck());
		setPlayerHand([gameDeck.draw()!, gameDeck.draw()!]);
		setDealerHand([gameDeck.draw()!, gameDeck.draw()!]);
		setplayerHandValue(calculateHandValue(playerHand));
		setplayerTurn(true);
	};

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
		setPlayerHand([...playerHand, gameDeck.draw()!]);
		setplayerHandValue(calculateHandValue(playerHand));
		if (playerHandValue > 21) {
			console.log(playerHandValue);
			setplayerTurn(false);
		}
	};

	const stand = () => {
		setplayerTurn(false);
		while (calculateHandValue(dealerHand) <= 17) {
			setDealerHand([...dealerHand, gameDeck.draw()!]);
		}
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
				<div className='hand player-hand'>
					Player Hand <br />
					{playerHand.map((card, index) => (
						<CardComponent key={index} card={card} />
					))}
					<br />
					<div key={playerHandValue}>PlayerHand Value {playerHandValue}</div>
				</div>
			</div>
			<div>
				{playerTurn && (
					<>
						<button onClick={drawplayerCard}>Hit</button>
						<button onClick={stand}>Stand</button>
					</>
				)}
			</div>
		</>
	);
};

export default BlackjackGame;
