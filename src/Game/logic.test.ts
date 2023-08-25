import { allowcardNextToWithPreviouslyPlacedCards } from "./logic";
import { GameBoardState } from "./types";


test('allowcardNextToWithPreviouslyPlacedCards', () => {
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