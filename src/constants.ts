import { GamePieceColors, GamePiecePictures } from "./Game/types";

export const SVGNS = "http://www.w3.org/2000/svg";
export const PIECE_SIZE = 10;
export const PIECE_DUPLICATES = 3;
export const TOTAL_PIECES = Object.keys(GamePieceColors).length * Object.keys(GamePiecePictures).length * PIECE_DUPLICATES;
export const TOTAL_SIZE = PIECE_SIZE * (TOTAL_PIECES / 2)