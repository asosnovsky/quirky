import { AIAction, AIGBS, AIPlayer, MoveEvaluator } from "./types";


export class DumbAI implements AIPlayer {
    constructor(
        private evaluator: MoveEvaluator
    ){}
    act({
        hand,
    }: AIGBS): AIAction {
        hand.map(
            c => {
                const scores = this.evaluator.getPlacements(c).map(p => {
                    return this.evaluator.evaluate({
                        'action': [{piece: c, ...p}]
                    })
                }).filter( p => p.type === 'allowed' )
            }
        )
    }
}