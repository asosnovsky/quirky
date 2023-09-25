import { PlacedGamePiece } from "./types";


export class CardBoardMap {
    private data: Record<string, number>;
    constructor(
        private placedCards: PlacedGamePiece[],
    ) {
        this.data = this.placedCards.reduce<Record<string, number>>(
            (total, { pos: [x, y] }, i) => ({
                ...total,
                [`${x},${y}`]: i,
            }),
            {}
        )
    }

    get(x: number, y: number): number | null {
        return this.data[`${x},${y}`] ?? null;
    }
}