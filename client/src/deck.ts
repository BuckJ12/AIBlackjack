// Deck.ts
type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
type Rank =
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| 'J'
	| 'Q'
	| 'K'
	| 'A';

export interface Card {
	suit: Suit;
	rank: Rank;
}

export class Deck {
	cards: Card[] = [];

	constructor() {
		this.initializeDeck();
	}

	initializeDeck() {
		const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
		const ranks: Rank[] = [
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
			'J',
			'Q',
			'K',
			'A',
		];

		for (const suit of suits) {
			for (const rank of ranks) {
				this.cards.push({ suit, rank });
			}
		}

		this.shuffle();
	}

	shuffle() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}

	draw(): Card | undefined {
		return this.cards.shift();
	}
}
