import { PIECE_SIZE, TOTAL_SIZE } from "./constants";
import { GameBoardState, Positionable } from "./Game/types";

export const computeBBox = (state: Positionable[]): [[number, number], [number, number]] => state.reduce(([X, Y], { pos: [x, y] }) => [
    [Math.min(X[0], x), Math.max(X[1], x)],
    [Math.min(Y[0], y), Math.max(Y[1], y)],
], [[TOTAL_SIZE, 0], [TOTAL_SIZE, 0]]);

export const adjustPos = ([x, y]: [number, number]): Record<string, number> => ({
    "x": Math.round(x * PIECE_SIZE),
    "y": Math.round(y * PIECE_SIZE),
    "height": PIECE_SIZE * 0.95,
    "width": PIECE_SIZE * 0.95,
})
export const applyAttributesToElm = (elm: SVGElement, attrs: Record<string, any>) =>
    Object.keys(attrs).forEach(k => elm.setAttribute(k, String(attrs[k])))
export const randomIndex = (n: number) => Math.round(Math.random() * n)
export function randomChoice<T>(arr: T[]): T {
    return arr[randomIndex(arr.length - 1)]
}

export const encodeState = (gameState: GameBoardState) =>
    btoa(JSON.stringify(gameState))

export const decodeState = (encodedState: string): GameBoardState =>
    JSON.parse(atob(encodedState))
