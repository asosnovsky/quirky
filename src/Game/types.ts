export const GamePieceColors = {
    red: '#FF3333',
    green: '#00fa00',
    blue: '#477fe0',
    yellow: '#ffff00',
    orange: '#ff9333',
    purple: '#d3a7ff',
} as const

export const GamePieceColorsInverse: Record<keyof typeof GamePieceColors, string> = {
    red: GamePieceColors['orange'],
    green: GamePieceColors['yellow'],
    blue: GamePieceColors['purple'],
    yellow: GamePieceColors['green'],
    orange: GamePieceColors['red'],
    purple: GamePieceColors['blue'],
} as const

export const GamePiecePictures = {
    cat: '🐼',
    owl: '🦄',
    cow: '🐮',
    monkey: '🐵',
    whale: '🐳',
    bear: '🐸',
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
