import { Game } from "./Game";
import { ManagedGameState } from "./Game/state";
import { GameBoardState } from "./Game/types";
import { MainMenu } from "./MainMenu";
import { QuirkyElements } from "./elements";


const qElms = QuirkyElements.fromIndexHtml();
const mm = new MainMenu(qElms, playerNames => {
    qElms.show('game');
    const game = Game.fromPlayerNames(qElms, playerNames);
    game.start();
});
mm.start();


(window as any).startFromState = (state: GameBoardState) => {
    qElms.show('game');
    const game = new Game(qElms, ManagedGameState.fromState(state));
    game.draw()
} 