export const GamePieceColors = {
    red: '#FF3333',
    green: '#33FF33',
    blue: '#d3a7ff',
    yellow: '#FFFF33',
    orange: '#ff9333',
    purple: '#9933FF',
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
