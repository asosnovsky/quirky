import { randomIndex } from "../helpers";
import { Deck } from "./Deck";
import { ComputedScore, computeCurrentPlacementScore, figureDirection } from "./logic";
import { GameBoardState, GamePiece, Player } from "./types";

export class ManagedGameState {

    static fromPlayerNames(playerNames: string[]) {
        const deck = new Deck();
        return new ManagedGameState(
            deck,
            {
                lastPlacedPCardIndices: [],
                currentDirection: null,
                players: playerNames.map((name, i) => ({
                    name,
                    number: i,
                    hand: deck.getCards(6),
                    points: 0
                })),
                currentPlayerIndex: randomIndex(playerNames.length - 1),
                currentCardIndex: null,
                placedCards: [],
            }
        )
    }

    static fromState(state: GameBoardState) {
        const deck = new Deck();
        state.placedCards.forEach(({ piece }) => deck.removeCard(piece));
        state.players.forEach(p => p.hand.forEach(deck.removeCard));
        return new ManagedGameState(
            deck,
            state,
        )
    }

    constructor(
        private deck: Deck,
        private state: GameBoardState,
        private history: [GameBoardState, GamePiece[]][] = [],
    ) { }

    get lastPlacedPCardIndices() {
        return this.state.lastPlacedPCardIndices
    }

    get currentCardIndex() {
        return this.state.currentCardIndex
    }

    get currentPlayerIndex() {
        return this.state.currentPlayerIndex
    }

    get currentPlayer() {
        return this.state.players[this.state.currentPlayerIndex]
    }

    get lastPlacedCard() {
        return this.state.placedCards[this.state.lastPlacedPCardIndices[this.state.lastPlacedPCardIndices.length - 1]]
    }

    get totalCardsLeft() {
        return this.deck.totalCardsLeft
    }

    private saveHistory() {
        this.history.push(JSON.parse(JSON.stringify([this.state, this.deck.export()])))
    }

    export() {
        return {
            deck: this.deck.export(),
            state: this.state,
            history: this.history,
        }
    }

    placeCard(x: number, y: number): boolean {
        const { currentCardIndex } = this;
        if (currentCardIndex !== null) {
            this.saveHistory();
            const selectedCard = this.currentPlayer.hand.splice(currentCardIndex, 1)[0];
            if (this.state.lastPlacedPCardIndices.length > 0) {
                const direction = figureDirection({
                    pos: [x, y]
                }, this.lastPlacedCard)
                if (direction === null) {
                    window.alert("direction === null should not happen")
                    throw new Error("direction === null should not happen")
                }
                this.state.currentDirection = direction;
            }
            this.state.lastPlacedPCardIndices.push(this.state.placedCards.length);
            this.state.placedCards.push({
                'piece': selectedCard,
                'pos': [x, y],
            })
            this.state.currentCardIndex = null;
            return true
        }
        return false
    }

    setCurrentCard(index: number) {
        this.saveHistory();
        this.state.currentCardIndex = index;
    }

    private swithToNextPlayer() {
        this.state.currentPlayerIndex = this.state.currentPlayerIndex >= (this.state.players.length - 1) ? 0 : this.state.currentPlayerIndex + 1;
        this.state.currentCardIndex = null;
        this.state.lastPlacedPCardIndices = [];
        this.state.currentDirection = null;
    }

    private ensureAllHaveCards() {
        this.state.players.forEach(p => {
            while (p.hand.length < 6) {
                p.hand.push(this.deck.getCard())
            }
        })
    }

    nextTurn(): ComputedScore {
        const {pts, quirky} = computeCurrentPlacementScore(this.state)
        this.currentPlayer.points += pts;
        this.saveHistory();
        this.ensureAllHaveCards();
        this.swithToNextPlayer();
        return {pts, quirky};
    }

    forEachPlayer(fcn: (p: Player, pi: number) => void) {
        this.state.players.forEach(fcn)
    }

    undo() {
        const lastHist = this.history.pop()
        if (lastHist) {
            const [state, cards] = lastHist;
            this.deck = new Deck(cards);
            this.state = state;
        }
    }
}