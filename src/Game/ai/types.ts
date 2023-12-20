import { GamePiece, PlacedGamePiece, Positionable } from "../types";



export type AIGBS = {
    placedCards: PlacedGamePiece[];
    hand: GamePiece[];
    remainingCards: number;
}

export type AIAction = {
    action: PlacedGamePiece[];
}

export type AIActionResults = {
    type: 'allowed';
    points: number;
} | {
    type: 'not-allowed';
}

export type AIPlayer = {
    act(state: AIGBS): AIAction;
}

export type MoveEvaluator = {
    evaluate(action: AIAction): AIActionResults;
    getPlacements(card: GamePiece): Positionable[];
}