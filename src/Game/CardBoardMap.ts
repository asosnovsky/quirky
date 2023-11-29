import { GamePiece, PlacedGamePiece, Positionable } from "./types";


export const allowCardNextTo = (p1: GamePiece, p2: GamePiece): boolean =>
    (p1.color === p2.color || p1.picture === p2.picture) &&
    (p1.color !== p2.color || p1.picture !== p2.picture)

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

    getCard(x: number, y: number): GamePiece | null {
        const i = this.get(x, y)
        if (i !== null) {
            return this.placedCards[i].piece
        }
        return null;
    }

    allowedToPlace(
        piece: GamePiece,
        [x, y]: Positionable['pos'],
    ): boolean {
        let d = 1;
        let okU = true;
        let okD = true;
        let okL = true;
        let okR = true;
        while (okD || okL || okR || okU) {
            if (okL) {
                const card = this.getCard(x - d, y);
                if (card !== null) {
                    if (!allowCardNextTo(piece, card)) {
                        return false
                    }
                } else {
                    okL = false
                }
            }
            if (okR) {
                const card = this.getCard(x + d, y);
                if (card !== null) {
                    if (!allowCardNextTo(piece, card)) {
                        return false
                    }
                } else {
                    okR = false
                }
            }
            if (okU) {
                const card = this.getCard(x, y + d);
                if (card !== null) {
                    if (!allowCardNextTo(piece, card)) {
                        return false
                    }
                } else {
                    okU = false
                }
            }
            if (okD) {
                const card = this.getCard(x, y - d);
                if (card !== null) {
                    if (!allowCardNextTo(piece, card)) {
                        return false
                    }
                } else {
                    okD = false
                }
            }
            d += 1
        }
        return true
    }
}