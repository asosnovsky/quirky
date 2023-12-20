import { QuirkyElements } from "../elements";
import { SvgBoard } from "./SvgBoard";
import { ComputedScore } from "./logic";
import { ManagedGameState } from "./state";
import { GamePieceColors, GamePiecePictures, Player } from "./types";



export class Game {

    private svgBoard: SvgBoard;

    static fromPlayerNames(
        qElms: QuirkyElements,
        playerNames: string[],
    ) {
        return new Game(
            qElms,
            ManagedGameState.fromPlayerNames(playerNames),
        )
    }

    constructor(
        private qElms: QuirkyElements,
        public board: ManagedGameState,
    ) {
        this.svgBoard = new SvgBoard(qElms.svg, this.handlePlacementClick);
    }

    handlePlacementClick = (x: number, y: number) => {
        if (this.board.placeCard(x, y)) {
            this.draw();
        }
    }

    draw() {
        this.drawHand(this.board.currentPlayer)
        this.drawHoverBox();
        this.svgBoard.render(this.board.export()['state'])
    }

    drawHand(player: Player) {
        const nameElm = this.qElms.hand.querySelector('#name') as HTMLSpanElement;
        const cardNumElm = this.qElms.hand.querySelector('#card-count') as HTMLSpanElement;
        const cardElm = this.qElms.hand.querySelector('#cards') as HTMLDivElement;
        nameElm.innerText = player.name;
        cardNumElm.innerText = String(player.hand.length);
        cardElm.innerHTML = ""
        player.hand.forEach((card, i) => {
            const elm = document.createElement('span')
            elm.innerText = GamePiecePictures[card.picture]
            elm.style.background = GamePieceColors[card.color]
            elm.setAttribute('card-color', card.color)
            elm.setAttribute('card-picture', card.picture)
            if (i === this.board.currentCardIndex) {
                elm.className = "selected"
            }
            elm.onclick = () => {
                this.board.setCurrentCard(i);
                this.draw();
            }
            cardElm.append(elm);
        })
    }

    drawHoverBox() {
        this.qElms.cardsInDeck.innerText = String(this.board.totalCardsLeft);
        const playersElm = this.qElms.hoverPlayers;
        playersElm.innerHTML = ""
        this.board.forEachPlayer((p, i) => {
            const pElm = document.createElement('span');
            if (i === this.board.currentPlayerIndex) {
                pElm.className = "selected"
            }
            pElm.innerText = `${p.name} (${p.points})`;
            playersElm.append(pElm);
        })
    }

    drawPoints({pts, quirky}: ComputedScore, next: () => void) {
        const pElm = document.createElement('span');
        pElm.innerText = `+${pts}pts`
        pElm.className = "points"
        if(quirky) {
            const iElm = document.createElement('i');
            iElm.classList.add('icon')
            iElm.classList.add('baloons')
            pElm.append(iElm)
        }
        this.qElms.hoverPlayers.append(pElm);
        const baseStart = 3;
        const size = baseStart + 2 * (1 - Math.exp(-pts));
        pElm.style.height = `${baseStart}em` 
        pElm.style.width = `${baseStart}em` 
        window.requestAnimationFrame(() => {
            pElm.style.top = '-2em';
            pElm.style.right = '-10em';
            pElm.style.opacity = '0';
            pElm.style.height = `${size}em`
            pElm.style.width = `${size}em`
            pElm.style.borderRadius = `100%`
            window.setTimeout(() => {
                pElm.remove();
                next();
            }, 1500);
        })
    }

    nextTurn() {
        const {pts, quirky} = this.board.nextTurn();
        if(pts > 0) {
            this.drawHand(this.board.currentPlayer);
            this.drawPoints({pts, quirky}, () => {
                this.drawHoverBox();
                this.svgBoard.render(this.board.export()['state']);
            });
        }   else {
            this.draw();
        }
    }
    
    registerButtons() {
        this.qElms.bottomBarBtnEndTurn.onclick = () => {
            this.nextTurn();
        }
        this.qElms.g_btnUndo.onclick = () => {
            this.board.undo();
            this.draw();
        }
    }
    start() {
        this.registerButtons()
        this.nextTurn()
    }

}
