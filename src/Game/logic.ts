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
