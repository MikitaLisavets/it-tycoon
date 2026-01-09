export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    suit: Suit;
    rank: Rank;
    isFaceUp: boolean;
    id: string;
}

export type Pile = Card[];

export interface SolitaireState {
    stock: Pile;
    waste: Pile;
    foundation: Record<Suit, Pile>;
    tableau: Pile[];
}

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
    const deck: Card[] = [];
    SUITS.forEach(suit => {
        RANKS.forEach(rank => {
            deck.push({
                suit,
                rank,
                isFaceUp: false,
                id: `${rank}-${suit}`
            });
        });
    });
    return deck;
};

export const shuffle = (deck: Card[]): Card[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
};

export const initializeGame = (): SolitaireState => {
    const deck = shuffle(createDeck());
    const tableau: Pile[] = [];
    let deckIndex = 0;

    for (let i = 0; i < 7; i++) {
        const pile: Pile = [];
        for (let j = 0; j <= i; j++) {
            const card = { ...deck[deckIndex++], isFaceUp: j === i };
            pile.push(card);
        }
        tableau.push(pile);
    }

    const stock = deck.slice(deckIndex).map(c => ({ ...c, isFaceUp: false }));

    return {
        stock,
        waste: [],
        foundation: {
            spades: [],
            hearts: [],
            diamonds: [],
            clubs: []
        },
        tableau
    };
};

export const getSuitColor = (suit: Suit): 'red' | 'black' => {
    return (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
};

export const getRankValue = (rank: Rank): number => {
    const values: Record<Rank, number> = {
        'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
    };
    return values[rank];
};

export const canMoveToFoundation = (card: Card, foundationPile: Pile, targetSuit: Suit): boolean => {
    if (card.suit !== targetSuit) return false;

    if (foundationPile.length === 0) {
        return card.rank === 'A';
    }
    const topCard = foundationPile[foundationPile.length - 1];
    return getRankValue(card.rank) === getRankValue(topCard.rank) + 1;
};

export const canMoveToTableau = (card: Card, tableauPile: Pile): boolean => {
    if (tableauPile.length === 0) {
        return card.rank === 'K';
    }
    const topCard = tableauPile[tableauPile.length - 1];
    return getSuitColor(card.suit) !== getSuitColor(topCard.suit) &&
        getRankValue(card.rank) === getRankValue(topCard.rank) - 1;
};
