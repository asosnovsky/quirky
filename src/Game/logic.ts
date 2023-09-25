import { CardBoardMap } from "./CardBoardMap";
import { GameBoardState, GamePiece, Positionable } from "./types";

export const Border = () => {
    const state: Record<string, boolean> = {};
    const mi = (x: number, y: number): string => `${x},${y}`;
    return {
        getAll() {
            return state;
        },
        get(x: number, y: number) {
            return state[mi(x, y)] ?? false;
        },
        setTrueIf(x: number, y: number) {
            state[mi(x, y)] = state[mi(x, y)] ?? true;
        },
        setFalse(x: number, y: number) {
            state[mi(x, y)] = false;
        },
        apply(fcn: (x: number, y: number) => void) {
            Object.keys(state).forEach(key => {
                if (state[key]) {
                    const [x, y] = key.split(',').map(Number);
                    fcn(x, y);
                }
            })
        }
    }
}

export const allowCardNextTo = (p1: GamePiece, p2: GamePiece): boolean =>
    (p1.color === p2.color || p1.picture === p2.picture) &&
    (p1.color !== p2.color || p1.picture !== p2.picture)

export const allowcardNextToWithPreviouslyPlacedCards = (
    currentCard: GamePiece,
    [x, y]: Positionable['pos'],
    lastPlacedPCardIndices: GameBoardState['lastPlacedPCardIndices'],
    placedCards: GameBoardState['placedCards'],
    currentDirection: GameBoardState['currentDirection'],
): boolean => lastPlacedPCardIndices.filter(i => {
    const { piece, pos } = placedCards[i];
    if (currentDirection === '⟷') {
        if (pos[0] != x) {
            return false
        }
        const innerCheck = placedCards.filter(pc => {
            if (pc.pos[0] === 0) {
                return allowCardNextTo(pc.piece, piece)
            }
            return false
        }).length === placedCards.length
        if (!innerCheck) {
            return false;
        }
    }
    if (currentDirection === '⭥') {
        if (pos[1] != y) {
            return false
        }
        const innerCheck = placedCards.filter(pc => {
            if (pc.pos[1] === 0) {
                return allowCardNextTo(pc.piece, piece)
            }
            return false
        }).length === placedCards.length
        if (!innerCheck) {
            return false;
        }
    }
    if (!(pos[0] === x || pos[1] === y)) {
        return false
    }
    return allowCardNextTo(currentCard, piece)
}).length > 0

export const allowcardNextToWithNoPlacedCardsButCardsOnBoard = (
    currentCard: GamePiece,
    [x, y]: Positionable['pos'],
    placedCards: GameBoardState['placedCards'],
): boolean => {
    const row = placedCards.filter(p =>
        p.pos[0] === x
    )
    if (row.length !== row.filter(r => allowCardNextTo(r.piece, currentCard)).length) {
        return false
    }
    const col = placedCards.filter(p =>
        p.pos[1] === y
    )
    if (col.length !== col.filter(r => allowCardNextTo(r.piece, currentCard)).length) {
        return false
    }
    return true
}

export const figureDirection = (p1: Positionable, p2: Positionable): GameBoardState['currentDirection'] => {
    if (p1.pos[0] - p2.pos[0] === 0) {
        return '⟷'
    } else if (p1.pos[1] - p2.pos[1] === 0) {
        return '⭥'
    } else {
        return null;
    }
}

export const makeComputeBoundaries = (
    placedCards: GameBoardState['placedCards'],
    lastPlacedPCardIndices: GameBoardState['lastPlacedPCardIndices'],
) => (along: number = 0): [number, number] => lastPlacedPCardIndices.reduce<[number, number]>(([mn, mx], i) => {
    const yy = placedCards[i].pos[along];
    return [Math.max(mn, yy), Math.min(mx, yy)]
}, [-Number.MAX_VALUE, Number.MAX_VALUE])

export const computeCurrentPlacementScore = ({
    placedCards,
    lastPlacedPCardIndices,
    currentDirection,
}: {
    placedCards: GameBoardState['placedCards'],
    lastPlacedPCardIndices: GameBoardState['lastPlacedPCardIndices'],
    currentDirection: GameBoardState['currentDirection'],
}): number => {
    let runningTotal = 0;
    const pMap = new CardBoardMap(placedCards);
    lastPlacedPCardIndices.forEach((ci, ii) => {
        const [x, y] = placedCards[ci].pos;
        let okL = (currentDirection !== '⭥' || ii === 0),
            okR = (currentDirection !== '⭥' || ii === 0),
            okU = (currentDirection !== '⟷' || ii === 0),
            okD = (currentDirection !== '⟷' || ii === 0);
        let d = 1;
        while (okL || okR || okD || okU) {
            if (okL && (pMap.get(x - d, y) !== null)) {
                runningTotal += (d === 1 ? 2 : 1)
            } else {
                okL = false
            }
            if (okR && (pMap.get(x + d, y) !== null)) {
                runningTotal += ((d === 1 && !okL) ? 2 : 1)
            } else {
                okR = false
            }
            if (okU && (pMap.get(x, y + d) !== null)) {
                runningTotal += (d === 1 ? 2 : 1)
            } else {
                okU = false
            }
            if (okD && (pMap.get(x, y - d) !== null)) {
                runningTotal += ((d === 1 && !okU) ? 2 : 1)
            } else {
                okD = false
            }
            d += 1
        }
    })

    return runningTotal
}
