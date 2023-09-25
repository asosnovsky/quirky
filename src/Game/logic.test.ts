import { allowcardNextToWithPreviouslyPlacedCards, computeCurrentPlacementScore, figureDirection } from "./logic";
import { GameBoardState, GamePiece, PlacedGamePiece, Positionable } from "./types";

const makeCard = (color: GamePiece['color'], picture: GamePiece['picture'], pos: Positionable['pos']): PlacedGamePiece => ({
    pos,
    piece: {
        color, picture
    }
})

const makeInput = (
    current: PlacedGamePiece[],
    newlyPlaced: PlacedGamePiece[],
) => ({
    placedCards: [
        ...current,
        ...newlyPlaced,
    ],
    lastPlacedPCardIndices: newlyPlaced.map((_, i) => current.length + i),
    currentDirection: newlyPlaced.length > 1 ? figureDirection(newlyPlaced[0], newlyPlaced[1]) : null,
})

test('allowcardNextToWithPreviouslyPlacedCards should not allow repeats', () => {
    const placedCards: GameBoardState['placedCards'] = [
        {
            "piece": {
                "color": "purple",
                "picture": "cow"
            },
            "pos": [
                0,
                0
            ]
        },
        {
            "piece": {
                "color": "red",
                "picture": "cow"
            },
            "pos": [
                0,
                1
            ]
        },
        {
            "piece": {
                "color": "blue",
                "picture": "cow"
            },
            "pos": [
                0,
                2
            ]
        }
    ];
    expect(allowcardNextToWithPreviouslyPlacedCards(
        { color: 'blue', picture: 'bear' },
        [0, 3],
        [0, 1, 2],
        placedCards,
        '⟷'
    )).toBe(false);
})


describe('computeCurrentPlacementScore', () => {
    describe('should compute score when initial are placed', () => {
        test('horizontally', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [],
                    [makeCard('blue', 'bear', [0, 0]),
                    makeCard('blue', 'whale', [0, 1])],
                )
            )).toBe(2)
        })
        test('vertically', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [],
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('blue', 'whale', [1, 0]),
                    ],
                )
            )).toBe(2)
        })
    })
    describe('should compute score when follow up are placed', () => {
        test('horizontally on same piece', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('blue', 'whale', [1, 0]),
                    ],
                    [
                        makeCard('blue', 'cat', [1, 1]),
                        makeCard('blue', 'monkey', [1, 2]),
                    ],
                )
            )).toBe(3)
        })
        test('horizontally on 1 piece', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('blue', 'whale', [1, 0]),
                    ],
                    [
                        makeCard('blue', 'cat', [2, 0]),
                        makeCard('blue', 'monkey', [2, 1]),
                    ],
                )
            )).toBe(5)
        })
        test('vertically on 1 piece', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('blue', 'whale', [1, 0]),
                    ],
                    [
                        makeCard('blue', 'owl', [1, -1]),
                    ],
                )
            )).toBe(2)
        })
        test('vertically on same 2 pieces', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('blue', 'whale', [1, 0]),
                    ],
                    [
                        makeCard('blue', 'owl', [1, -1]),
                        makeCard('blue', 'owl', [1, -2]),
                    ],
                )
            )).toBe(3)
        })
        test('vertically on one piece', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('red', 'cow', [0, 0]),
                    ],
                    [
                        makeCard('blue', 'cow', [1, 0]),
                        makeCard('green', 'cow', [1, 1]),
                    ],
                )
            )).toBe(4)
        })
        test('vertically 1 on 2', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('yellow', 'monkey', [0, 0]),
                        makeCard('yellow', 'cow', [-1, 0]),
                    ],
                    [
                        makeCard('yellow', 'bear', [1, 0]),
                    ],
                )
            )).toBe(3)
        })
    })
})


