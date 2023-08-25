import { PIECE_SIZE, SVGNS } from "../constants";
import { adjustPos, applyAttributesToElm, computeBBox } from "../helpers";
import { Border, allowCardNextTo, allowcardNextToWithNoPlacedCardsButCardsOnBoard, allowcardNextToWithPreviouslyPlacedCards } from "./logic";
import { GameBoardState, GamePieceColors, GamePiecePictures, PlacedGamePiece, Positionable } from "./types";



export class SvgBoard {
    constructor(
        private svg: SVGSVGElement,
        private onPlacementPieceClick: (x: number, y: number) => void,
    ) { }

    drawPiece = ({ pos, piece }: PlacedGamePiece) => {
        const apos = adjustPos(pos);
        const g = document.createElementNS(SVGNS, 'g');
        applyAttributesToElm(g, piece);
        const rect = document.createElementNS(SVGNS, 'rect');
        applyAttributesToElm(rect, apos)
        rect.setAttribute('fill', GamePieceColors[piece.color])
        rect.setAttribute('className', 'piece')
        g.appendChild(rect);
        const text = document.createElementNS(SVGNS, 'text');
        applyAttributesToElm(text, {
            "x": String(apos['x'] + apos['width'] / 2 - 2.5),
            "y": String(apos['y'] + apos['height'] / 2 + 1.75),
        });
        text.innerHTML = GamePiecePictures[piece.picture]
        g.appendChild(text);
        this.svg.appendChild(g)
    }


    drawPlacementBox = (x: number, y: number) => {
        const apos = adjustPos([x, y]);
        const g = document.createElementNS(SVGNS, 'g');
        const rect = document.createElementNS(SVGNS, 'rect');
        rect.setAttribute('className', 'placement')
        applyAttributesToElm(rect, apos)
        rect.setAttribute('fill', "#d8d8d8")
        rect.onclick = () => {
            this.onPlacementPieceClick(x, y);
        }
        g.appendChild(rect);
        this.svg.appendChild(g);

    }


    setViewBox = (state: Positionable[]) => window.requestAnimationFrame(() => {
        const [[mnx, mxx], [mny, mxy]] = computeBBox(state);
        const left = Math.min((mnx - 5) * PIECE_SIZE, 0)
        const top = Math.min((mny - 5) * PIECE_SIZE, 0)
        const right = (mxx + 5) * PIECE_SIZE
        const width = Math.max(right - left + 2 * PIECE_SIZE, 100)
        const bottom = (mxy + 5) * PIECE_SIZE
        const height = Math.max(bottom - top + 2 * PIECE_SIZE, 100)

        this.svg.setAttribute('viewBox', `${left} ${top} ${width} ${height}`)
        this.svg.style.width = `${500 * width / 120}px`
        this.svg.style.height = `${500 * height / 120}px`
    })

    clearBoard = () =>
        this.svg.innerHTML = ""

    render = (state: GameBoardState) => {
        this.clearBoard();
        const border = Border();
        state.placedCards.forEach(p => {
            this.drawPiece(p);
            border.setFalse(...p.pos);
            if (state.currentCardIndex !== null) {
                const currentCard = state.players[state.currentPlayerIndex].hand[state.currentCardIndex];
                if (allowCardNextTo(currentCard, p.piece)) {
                    [-1, 1].forEach(d => {
                        border.setTrueIf(p.pos[0], p.pos[1] + d)
                        border.setTrueIf(p.pos[0] + d, p.pos[1])
                    })
                } else {
                    [-1, 1].forEach(d => {
                        border.setFalse(p.pos[0], p.pos[1] + d)
                        border.setFalse(p.pos[0] + d, p.pos[1])
                    })
                }
            }
        });
        if (state.placedCards.length === 0) {
            this.drawPlacementBox(0, 0)
            this.setViewBox([
                { pos: [0, 0] }
            ]);
        } else if (state.lastPlacedPCardIndices.length > 0 && state.currentCardIndex !== null) {
            const currentCard = state.players[state.currentPlayerIndex].hand[state.currentCardIndex];
            border.apply((x, y) => {
                if (allowcardNextToWithPreviouslyPlacedCards(
                    currentCard,
                    [x, y],
                    state.lastPlacedPCardIndices,
                    state.placedCards,
                    state.currentDirection,
                )) {
                    this.drawPlacementBox(x, y);
                }
            })
        } else if (state.currentCardIndex !== null) {
            const currentCard = state.players[state.currentPlayerIndex].hand[state.currentCardIndex];
            border.apply((x, y) => {
                if (allowcardNextToWithNoPlacedCardsButCardsOnBoard(
                    currentCard,
                    [x, y],
                    state.placedCards,
                )) {
                    this.drawPlacementBox(x, y);
                }
            })
            this.setViewBox(state.placedCards);
        }
    }
}