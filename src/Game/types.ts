export const GamePieceColors = {
    red: '#F00',
    green: '#0F0',
    blue: '#6da2fb',
    yellow: '#0AA',
    orange: '#AA0',
    purple: '#A0A',
} as const

export const GamePiecePictures = {
    cat: '🐈',
    owl: '🦉',
    cow: '🐮',
    monkey: '🐵',
    whale: '🐳',
    bear: '🐻',
} as const

export type GamePiece = {
    picture: keyof typeof GamePiecePictures;
    color: keyof typeof GamePieceColors;
}
export type Positionable = {
    pos: [number, number];
}

export type PlacedGamePiece = Positionable & {
    piece: GamePiece;
}

export type Player = {
    name: string;
    number: number;
    hand: GamePiece[];
    points: number;
}
export type GameBoardState = {
    placedCards: PlacedGamePiece[];
    currentPlayerIndex: number;
    currentCardIndex: number | null;
    players: Player[];
    currentDirection: '⭥' | '⟷' | null;
    lastPlacedPCardIndices: number[];
};
