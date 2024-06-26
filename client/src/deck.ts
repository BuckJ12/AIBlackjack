// Deck.ts
type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades' | 'Joker';
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
  | 'A'
  | '?';

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
    for (let i = 0; i < 8; i++) {
      for (const rank of ranks) {
        for (const suit of suits) {
          this.cards.push({ suit, rank });
        }
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

  draw(): Card {
    if (this.cards.length === 0) {
      this.initializeDeck();
    }
    return this.cards.shift()!;
  }

  length(): number {
    return this.cards.length;
  }

  static value(card: Card): number {
    if (card.rank === 'A') {
      return 11;
    } else if (card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') {
      return 10;
    } else {
      return parseInt(card.rank);
    }
  }
}
