import { PIECE_SIZE, SVGNS } from "../constants";
import { adjustPos, applyAttributesToElm, computeBBox } from "../helpers";
import { Border } from "./logic";
import { GameBoardState, GamePieceColors, GamePieceColorsInverse, GamePiecePictures, PlacedGamePiece, Positionable } from "./types";



export class SvgBoard {
    constructor(
        private svg: SVGSVGElement,
        private onPlacementPieceClick: (x: number, y: number) => void,
    ) { }

    drawPiece = ({ pos, piece }: PlacedGamePiece, isLastPlaced: boolean = false) => {
        const apos = adjustPos(pos);
        const g = document.createElementNS(SVGNS, 'g');
        applyAttributesToElm(g, piece);
        const rect = document.createElementNS(SVGNS, 'rect');
        applyAttributesToElm(rect, apos)
        rect.setAttribute('fill', GamePieceColors[piece.color])
        rect.setAttribute('className', 'piece')
        if (isLastPlaced) {
            rect.setAttribute('stroke', GamePieceColorsInverse[piece.color])
        }
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
        const border = Border.fromState(state)
        state.placedCards.forEach((p, i) => {
            this.drawPiece(p, state.lastPlacedPCardIndices.find(v => v == i) !== undefined)
        });
        if (state.placedCards.length === 0) {
            this.drawPlacementBox(0, 0)
            this.setViewBox([
                { pos: [0, 0] }
            ]);
        } else {
            let xsum:number = 0, ysum: number = 0, total: number = 0;
            border.apply((xx, yy) => {
                this.drawPlacementBox(xx, yy);
                xsum += xx;
                ysum += yy;
                total += 1;
            })
            if (total > 0) {
                this.setViewBox([
                    { pos: [xsum/total, ysum/total] }
                ]);
            }   else    {
                this.setViewBox(state.placedCards)
            }
        }
    }
}