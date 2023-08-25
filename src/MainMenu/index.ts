import { QuirkyElements } from "../elements";


export class MainMenu {
    constructor(
        private qElms: QuirkyElements,
        private onGameStart: (playerNames: string[]) => void,
    ) { }

    addPlayerNameBox() {
        const playerIndex = this.qElms.mm_names.childElementCount;
        const box = this.qElms.mm_tplPlayerName.content.cloneNode(true);
        const root = (box.getRootNode() as any).children[0] as HTMLDivElement;
        if (playerIndex <= 1) {
            root.querySelector('button.remove')?.remove()
        } else {
            (root.querySelector('button.remove') as HTMLButtonElement).onclick = () => {
                this.qElms.mm_names.removeChild(root);
            }
        }
        root.setAttribute('index', String(playerIndex));
        (root.querySelector('label') as any).innerText = `Player ${playerIndex + 1} Name`
        root.onkeydown = e => {
            if (e.key === 'Enter') {
                this.onStartClick();
            }
        }
        this.qElms.mm_names.append(box);
    }

    onStartClick = () => {
        const names: string[] = [];
        let errored: boolean = false;
        this.qElms.mm_names.querySelectorAll<HTMLInputElement>('input.player-name').forEach(e => {
            if (e.value.length === 0) {
                e.className += " red";
                (e.parentElement as any).className += " errored"
                errored = true;
            } else {
                (e.parentElement as any).className = "player"
                names.push(e.value);
            }
        });
        if (errored) {
            throw new Error("Not all players have a name!")
        }
        this.onGameStart(names);
    }

    start() {
        this.qElms.mm_btnAdd.onclick = () => this.addPlayerNameBox();
        this.qElms.mm_btnStart.onclick = this.onStartClick
        this.addPlayerNameBox();
        this.addPlayerNameBox();
    }
}