import { Border, allowcardNextToWithPreviouslyPlacedCards, computeCurrentPlacementScore, figureDirection } from "./logic";
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
            ).pts).toBe(2)
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
            ).pts).toBe(2)
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
            ).pts).toBe(3)
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
            ).pts).toBe(5)
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
            ).pts).toBe(2)
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
            ).pts).toBe(3)
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
            ).pts).toBe(4)
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
            ).pts).toBe(3)
        })
    })
    describe('should compute score with quirky', () => {
        test('simple case', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                    ],
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('blue', 'whale', [1, 0]),
                        makeCard('blue', 'cat', [2, 0]),
                        makeCard('blue', 'cow', [3, 0]),
                        makeCard('blue', 'monkey', [4, 0]),
                        makeCard('blue', 'owl', [5, 0]),
                    ],
                )
            )).toStrictEqual({ pts: 12, quirky: true })
        })
        test('simple case #2', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                    ],
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('green', 'bear', [0, 1]),
                        makeCard('orange', 'bear', [0, 2]),
                        makeCard('purple', 'bear', [0, 3]),
                        makeCard('red', 'bear', [0, 4]),
                        makeCard('yellow', 'bear', [0, 5]),
                    ],
                )
            )).toStrictEqual({ pts: 12, quirky: true })
        })
        test('quirky with some extra points case', () => {
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('red', 'bear', [0, -1]),
                    ],
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('blue', 'whale', [1, 0]),
                        makeCard('blue', 'cat', [2, 0]),
                        makeCard('blue', 'cow', [3, 0]),
                        makeCard('blue', 'monkey', [4, 0]),
                        makeCard('blue', 'owl', [5, 0]),
                    ],
                )
            )).toStrictEqual({ pts: 14, quirky: true })
            expect(computeCurrentPlacementScore(
                makeInput(
                    [
                        makeCard('red', 'bear', [1, 0]),
                    ],
                    [
                        makeCard('blue', 'bear', [0, 0]),
                        makeCard('green', 'bear', [0, 1]),
                        makeCard('orange', 'bear', [0, 2]),
                        makeCard('purple', 'bear', [0, 3]),
                        makeCard('red', 'bear', [0, 4]),
                        makeCard('yellow', 'bear', [0, 5]),
                    ],
                )
            )).toStrictEqual({ pts: 14, quirky: true })
        })
        test('quirky with partial and additional', () => {
            expect(computeCurrentPlacementScore(
                {
                    "lastPlacedPCardIndices": [
                        15,
                        16,
                        17
                    ],
                    "currentDirection": "⭥",
                    "placedCards": [
                        {
                            "piece": {
                                "color": "red",
                                "picture": "cow"
                            },
                            "pos": [
                                0,
                                0
                            ]
                        },
                        {
                            "piece": {
                                "color": "green",
                                "picture": "cow"
                            },
                            "pos": [
                                1,
                                0
                            ]
                        },
                        {
                            "piece": {
                                "color": "green",
                                "picture": "owl"
                            },
                            "pos": [
                                1,
                                1
                            ]
                        },
                        {
                            "piece": {
                                "color": "orange",
                                "picture": "owl"
                            },
                            "pos": [
                                2,
                                1
                            ]
                        },
                        {
                            "piece": {
                                "color": "green",
                                "picture": "monkey"
                            },
                            "pos": [
                                1,
                                2
                            ]
                        },
                        {
                            "piece": {
                                "color": "purple",
                                "picture": "monkey"
                            },
                            "pos": [
                                0,
                                2
                            ]
                        },
                        {
                            "piece": {
                                "color": "green",
                                "picture": "bear"
                            },
                            "pos": [
                                1,
                                3
                            ]
                        },
                        {
                            "piece": {
                                "color": "green",
                                "picture": "owl"
                            },
                            "pos": [
                                2,
                                3
                            ]
                        },
                        {
                            "piece": {
                                "color": "purple",
                                "picture": "owl"
                            },
                            "pos": [
                                3,
                                1
                            ]
                        },
                        {
                            "piece": {
                                "color": "yellow",
                                "picture": "owl"
                            },
                            "pos": [
                                3,
                                2
                            ]
                        },
                        {
                            "piece": {
                                "color": "yellow",
                                "picture": "monkey"
                            },
                            "pos": [
                                -1,
                                2
                            ]
                        },
                        {
                            "piece": {
                                "color": "yellow",
                                "picture": "bear"
                            },
                            "pos": [
                                -1,
                                3
                            ]
                        },
                        {
                            "piece": {
                                "color": "yellow",
                                "picture": "whale"
                            },
                            "pos": [
                                -1,
                                4
                            ]
                        },
                        {
                            "piece": {
                                "color": "yellow",
                                "picture": "cat"
                            },
                            "pos": [
                                -1,
                                1
                            ]
                        },
                        {
                            "piece": {
                                "color": "blue",
                                "picture": "cat"
                            },
                            "pos": [
                                -2,
                                1
                            ]
                        },
                        {
                            "piece": {
                                "color": "blue",
                                "picture": "monkey"
                            },
                            "pos": [
                                -2,
                                2
                            ]
                        },
                        {
                            "piece": {
                                "color": "orange",
                                "picture": "monkey"
                            },
                            "pos": [
                                -3,
                                2
                            ]
                        },
                        {
                            "piece": {
                                "color": "red",
                                "picture": "monkey"
                            },
                            "pos": [
                                -4,
                                2
                            ]
                        }
                    ]
                }
            )).toStrictEqual({ pts: 14, quirky: true })
        })
    })
})


describe('Border.fromState', () => {
    test('empty', () => {
        const b = Border.fromState({
            "lastPlacedPCardIndices": [],
            "currentDirection": null,
            "players": [
                {
                    "name": "Q",
                    "number": 0,
                    "hand": [
                        {
                            "color": "purple",
                            "picture": "cat"
                        },
                        {
                            "color": "yellow",
                            "picture": "monkey"
                        },
                        {
                            "color": "blue",
                            "picture": "cat"
                        },
                        {
                            "color": "purple",
                            "picture": "whale"
                        },
                        {
                            "color": "blue",
                            "picture": "owl"
                        },
                        {
                            "color": "yellow",
                            "picture": "monkey"
                        }
                    ],
                    "points": 0
                },
                {
                    "name": "V",
                    "number": 1,
                    "hand": [
                        {
                            "color": "red",
                            "picture": "cat"
                        },
                        {
                            "color": "orange",
                            "picture": "monkey"
                        },
                        {
                            "color": "green",
                            "picture": "monkey"
                        },
                        {
                            "color": "blue",
                            "picture": "cat"
                        },
                        {
                            "color": "red",
                            "picture": "cow"
                        },
                        {
                            "color": "red",
                            "picture": "cow"
                        }
                    ],
                    "points": 0
                }
            ],
            "currentPlayerIndex": 1,
            "currentCardIndex": null,
            "placedCards": []
        })
        expect(b.getAll()).toStrictEqual([])
    })
    test('single placed', () => {
        const b = Border.fromState({
            "lastPlacedPCardIndices": [
                0
            ],
            "currentDirection": null,
            "players": [
                {
                    "name": "A",
                    "number": 0,
                    "hand": [
                        {
                            "color": "green",
                            "picture": "cat"
                        },
                        {
                            "color": "blue",
                            "picture": "owl"
                        },
                        {
                            "color": "green",
                            "picture": "whale"
                        },
                        {
                            "color": "purple",
                            "picture": "cat"
                        },
                        {
                            "color": "purple",
                            "picture": "owl"
                        }
                    ],
                    "points": 0
                },
                {
                    "name": "v",
                    "number": 1,
                    "hand": [
                        {
                            "color": "yellow",
                            "picture": "monkey"
                        },
                        {
                            "color": "yellow",
                            "picture": "monkey"
                        },
                        {
                            "color": "purple",
                            "picture": "whale"
                        },
                        {
                            "color": "orange",
                            "picture": "owl"
                        },
                        {
                            "color": "yellow",
                            "picture": "cat"
                        },
                        {
                            "color": "orange",
                            "picture": "bear"
                        }
                    ],
                    "points": 0
                }
            ],
            "currentPlayerIndex": 0,
            "currentCardIndex": 2,
            "placedCards": [
                {
                    "piece": {
                        "color": "red",
                        "picture": "whale"
                    },
                    "pos": [
                        0,
                        0
                    ]
                }
            ]
        })
        expect(b.getAll()).toStrictEqual([
            "-1,0", "0,-1", "0,1", "1,0"
        ])
    })
    test('nothing', () => {
        const b = Border.fromState({
            "lastPlacedPCardIndices": [
                0
            ],
            "currentDirection": null,
            "players": [
                {
                    "name": "A",
                    "number": 0,
                    "hand": [
                        {
                            "color": "green",
                            "picture": "cat"
                        },
                        {
                            "color": "blue",
                            "picture": "owl"
                        },
                        {
                            "color": "green",
                            "picture": "whale"
                        },
                        {
                            "color": "purple",
                            "picture": "cat"
                        },
                        {
                            "color": "purple",
                            "picture": "owl"
                        }
                    ],
                    "points": 0
                },
                {
                    "name": "v",
                    "number": 1,
                    "hand": [
                        {
                            "color": "yellow",
                            "picture": "monkey"
                        },
                        {
                            "color": "yellow",
                            "picture": "monkey"
                        },
                        {
                            "color": "purple",
                            "picture": "whale"
                        },
                        {
                            "color": "orange",
                            "picture": "owl"
                        },
                        {
                            "color": "yellow",
                            "picture": "cat"
                        },
                        {
                            "color": "orange",
                            "picture": "bear"
                        }
                    ],
                    "points": 0
                }
            ],
            "currentPlayerIndex": 0,
            "currentCardIndex": 0,
            "placedCards": [
                {
                    "piece": {
                        "color": "red",
                        "picture": "whale"
                    },
                    "pos": [
                        0,
                        0
                    ]
                }
            ]
        })
        expect(b.getAll()).toStrictEqual([])
    })
    test('placing third one', () => {
        const b = Border.fromState({
            "lastPlacedPCardIndices": [
                0,
                1
            ],
            "currentDirection": "⭥",
            "players": [
                {
                    "name": "A",
                    "number": 0,
                    "hand": [
                        {
                            "color": "red",
                            "picture": "owl"
                        },
                        {
                            "color": "blue",
                            "picture": "monkey"
                        },
                        {
                            "color": "orange",
                            "picture": "cow"
                        },
                        {
                            "color": "orange",
                            "picture": "owl"
                        }
                    ],
                    "points": 0
                },
                {
                    "name": "V",
                    "number": 1,
                    "hand": [
                        {
                            "color": "purple",
                            "picture": "bear"
                        },
                        {
                            "color": "green",
                            "picture": "monkey"
                        },
                        {
                            "color": "green",
                            "picture": "cow"
                        },
                        {
                            "color": "red",
                            "picture": "cow"
                        },
                        {
                            "color": "yellow",
                            "picture": "owl"
                        },
                        {
                            "color": "orange",
                            "picture": "whale"
                        }
                    ],
                    "points": 0
                }
            ],
            "currentPlayerIndex": 0,
            "currentCardIndex": 0,
            "placedCards": [
                {
                    "piece": {
                        "color": "red",
                        "picture": "cat"
                    },
                    "pos": [
                        0,
                        0
                    ]
                },
                {
                    "piece": {
                        "color": "red",
                        "picture": "monkey"
                    },
                    "pos": [
                        1,
                        0
                    ]
                }
            ]
        })
        expect(b.getAll()).toStrictEqual(["-1,0", "2,0"])
    })
    test('place third should not be allowed vertically', () => {
        const b = Border.fromState({
            "lastPlacedPCardIndices": [
                2
            ],
            "currentDirection": null,
            "players": [
                {
                    "name": "A",
                    "number": 0,
                    "hand": [
                        {
                            "color": "green",
                            "picture": "whale"
                        },
                        {
                            "color": "orange",
                            "picture": "monkey"
                        },
                        {
                            "color": "yellow",
                            "picture": "monkey"
                        },
                        {
                            "color": "red",
                            "picture": "cow"
                        },
                        {
                            "color": "blue",
                            "picture": "whale"
                        },
                        {
                            "color": "yellow",
                            "picture": "owl"
                        }
                    ],
                    "points": 2
                },
                {
                    "name": "V",
                    "number": 1,
                    "hand": [
                        {
                            "color": "purple",
                            "picture": "whale"
                        },
                        {
                            "color": "orange",
                            "picture": "whale"
                        },
                        {
                            "color": "purple",
                            "picture": "whale"
                        },
                        {
                            "color": "green",
                            "picture": "cat"
                        },
                        {
                            "color": "green",
                            "picture": "cow"
                        }
                    ],
                    "points": 0
                }
            ],
            "currentPlayerIndex": 1,
            "currentCardIndex": 2,
            "placedCards": [
                {
                    "piece": {
                        "color": "yellow",
                        "picture": "owl"
                    },
                    "pos": [
                        0,
                        0
                    ]
                },
                {
                    "piece": {
                        "color": "orange",
                        "picture": "owl"
                    },
                    "pos": [
                        0,
                        1
                    ]
                },
                {
                    "piece": {
                        "color": "purple",
                        "picture": "owl"
                    },
                    "pos": [
                        -1,
                        0
                    ]
                }
            ]
        });
        expect(b.getAll()).toStrictEqual(["-1,-1"])
    })
    test('placing third invalid one', () => {
        const b = Border.fromState({
            "lastPlacedPCardIndices": [
                0,
                1
            ],
            "currentDirection": "⭥",
            "players": [
                {
                    "name": "A",
                    "number": 0,
                    "hand": [
                        {
                            "color": "yellow",
                            "picture": "bear"
                        },
                        {
                            "color": "red",
                            "picture": "cow"
                        },
                        {
                            "color": "red",
                            "picture": "bear"
                        },
                        {
                            "color": "blue",
                            "picture": "bear"
                        },
                        {
                            "color": "orange",
                            "picture": "owl"
                        },
                        {
                            "color": "yellow",
                            "picture": "cat"
                        }
                    ],
                    "points": 0
                },
                {
                    "name": "V",
                    "number": 1,
                    "hand": [
                        {
                            "color": "orange",
                            "picture": "whale"
                        },
                        {
                            "color": "yellow",
                            "picture": "cat"
                        },
                        {
                            "color": "purple",
                            "picture": "owl"
                        },
                        {
                            "color": "green",
                            "picture": "owl"
                        }
                    ],
                    "points": 0
                }
            ],
            "currentPlayerIndex": 1,
            "currentCardIndex": 2,
            "placedCards": [
                {
                    "piece": {
                        "color": "red",
                        "picture": "owl"
                    },
                    "pos": [
                        0,
                        0
                    ]
                },
                {
                    "piece": {
                        "color": "red",
                        "picture": "whale"
                    },
                    "pos": [
                        1,
                        0
                    ]
                }
            ]
        })
        expect(b.getAll()).toStrictEqual([])
    })

    test('no moves, same 4 colors then different color but same animal', () => {
        const b = Border.fromState({
            "lastPlacedPCardIndices": [
                0,
                1,
                2
            ],
            "currentDirection": "⭥",
            "players": [
                {
                    "name": "A",
                    "number": 0,
                    "hand": [
                        {
                            "color": "blue",
                            "picture": "monkey"
                        },
                        {
                            "color": "orange",
                            "picture": "cow"
                        },
                        {
                            "color": "orange",
                            "picture": "owl"
                        }
                    ],
                    "points": 0
                },
                {
                    "name": "V",
                    "number": 1,
                    "hand": [
                        {
                            "color": "purple",
                            "picture": "bear"
                        },
                        {
                            "color": "green",
                            "picture": "monkey"
                        },
                        {
                            "color": "green",
                            "picture": "cow"
                        },
                        {
                            "color": "red",
                            "picture": "cow"
                        },
                        {
                            "color": "yellow",
                            "picture": "owl"
                        },
                        {
                            "color": "orange",
                            "picture": "whale"
                        }
                    ],
                    "points": 0
                }
            ],
            "currentPlayerIndex": 0,
            "currentCardIndex": 2,
            "placedCards": [
                {
                    "piece": {
                        "color": "red",
                        "picture": "cat"
                    },
                    "pos": [
                        0,
                        0
                    ]
                },
                {
                    "piece": {
                        "color": "red",
                        "picture": "monkey"
                    },
                    "pos": [
                        1,
                        0
                    ]
                },
                {
                    "piece": {
                        "color": "red",
                        "picture": "owl"
                    },
                    "pos": [
                        2,
                        0
                    ]
                }
            ]
        });
        expect(b.getAll()).toStrictEqual([])
    })
})
