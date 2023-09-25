import { PIECE_DUPLICATES } from "../constants";
import { randomIndex } from "../helpers";
import { GamePiece, GamePieceColors, GamePiecePictures } from "./types";

const createDeck = (): GamePiece[] => {
    const deck: GamePiece[] = [];
    for (let _ = 0; _ < PIECE_DUPLICATES; _++) {
        Object.keys(GamePieceColors).forEach((color: any) =>
            Object.keys(GamePiecePictures).forEach((picture: any) => deck.push({
                color, picture,
            }))
        )
    }
    return deck;
}

export class Deck {
    constructor(
        private cards: GamePiece[] = createDeck(),
    ) { }

    export(): GamePiece[] {
        return JSON.parse(JSON.stringify(this.cards))
    }

    get totalCardsLeft() {
        return this.cards.length
    }

    getCard(): GamePiece {
        const index = randomIndex(this.totalCardsLeft);
        return this.cards.splice(index, 1)[0]
    }

    getCards(count: number): GamePiece[] {
        const cards: GamePiece[] = [];
        for (let i = 0; i < count; i++) {
            cards.push(this.getCard())
        }
        return cards
    }
}