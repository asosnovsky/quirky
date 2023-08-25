
export class QuirkyElements {

    static fromIndexHtml() {
        return new QuirkyElements(
            document.querySelector("#game") as HTMLDivElement,
            document.querySelector("#main-menu") as HTMLDivElement,
        )
    }

    constructor(
        public game: HTMLDivElement,
        public mainMenu: HTMLDivElement,
    ) {
        this.show('menu');
    }

    show(what: 'game' | 'menu') {
        if (what === 'game') {
            this.game.style.display = '';
            this.mainMenu.style.display = 'none';
        } else {
            this.game.style.display = 'none';
            this.mainMenu.style.display = '';
        }
    }

    // Game 

    get board() {
        return this.game.querySelector('#board') as HTMLDivElement;
    }

    get hand() {
        return this.game.querySelector('#hand') as HTMLDivElement;
    }

    get hover() {
        return this.game.querySelector('#hover-box') as HTMLDivElement;
    }
    get svg(): SVGSVGElement {
        return this.board.querySelector("svg") as SVGSVGElement
    }

    get cardsInDeck(): HTMLSpanElement {
        return this.hover.querySelector('#cards-in-deck') as HTMLSpanElement;
    }

    get hoverPlayers(): HTMLDivElement {
        return this.hover.querySelector('#players') as HTMLDivElement;
    }

    get bottomBar(): HTMLDivElement {
        return this.game.querySelector('#bottom-bar') as HTMLDivElement;
    }

    get bottomBarBtnEndTurn(): HTMLButtonElement {
        return this.bottomBar.querySelector('#end-turn') as HTMLButtonElement;
    }

    get g_btnUndo() {
        return this.bottomBar.querySelector('button#undo') as HTMLButtonElement;
    }


    // Main Menu

    get mm_tplPlayerName(): HTMLTemplateElement {
        return this.mainMenu.querySelector('template#player-name') as HTMLTemplateElement;
    }
    get mm_names(): HTMLDivElement {
        return this.mainMenu.querySelector('#names') as HTMLDivElement;
    }
    get mm_btnAdd() {
        return this.mainMenu.querySelector('button#add-name') as HTMLButtonElement
    }
    get mm_btnStart() {
        return this.mainMenu.querySelector('button#start-game') as HTMLButtonElement
    }
}

