import { Game } from "./Game";
import { ManagedGameState } from "./Game/state";
import { GameBoardState } from "./Game/types";
import { MainMenu } from "./MainMenu";
import { QuirkyElements } from "./elements";
import { decodeData } from "./helpers";



const qElms = QuirkyElements.fromIndexHtml();
const start = () => {
    if (window.location.hash.startsWith('#state=')) {
        const raw = window.location.hash.split('#state=')[1]
        console.log('detected state', raw)
        const data = decodeData<any>(raw)
        console.log('detected state', data)
        startFromState(data.state);
        return
    } 
    const mm = new MainMenu(qElms, playerNames => {
        qElms.show('game');
        const game = Game.fromPlayerNames(qElms, playerNames);
        game.start();
    });
    mm.start();
}

const startFromState = (state: GameBoardState) => {
    qElms.show('game');
    const game = new Game(qElms, ManagedGameState.fromState(state));
    game.registerButtons()
    game.draw()
} 



(window as any).startFromState = startFromState


start();