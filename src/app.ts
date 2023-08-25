import { Game } from "./Game";
import { MainMenu } from "./MainMenu";
import { QuirkyElements } from "./elements";


const qElms = QuirkyElements.fromIndexHtml();
const mm = new MainMenu(qElms, playerNames => {
    qElms.show('game');
    const game = Game.fromPlayerNames(qElms, playerNames);
    game.start();
});
mm.start();
