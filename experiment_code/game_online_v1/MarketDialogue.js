import Diagram from "./Diagram.js";
import DialogueScene from "./DialogueScene.js";
import ProfitSummary from "./ProfitSummary.js";

/**
 * @classdesc
 * The dialogue that is displayed after the player clicks on the market building.
 * It renders a summary consisting of the player's profits and optimal values.
 * @class MarketDialogue
 * @extends DialogueScene
 * @see Market
 * @see ProfitSummary
 */
class MarketDialogue extends DialogueScene
{
    constructor()
    {
        super('marketDialogue');
    }
    
    /**
     *  This function is responsible for rendering the {@link ProfitSummary}
     */
    create()
    {
        // bind the market to the dialogue
        this.market = this.data.market; 
        // create the default panel to wrap the summary
        this.createDialogue('Letzter Monat:');
        if (this.mainScene.month.value == 0) // If we are at the first month, display this message instead of a summary.
        {
            this.panel.add(new Phaser.GameObjects.Text(this.mainScene, -175,-50, 'Die Profitübersicht ist ab \n\ndem nächsten Monat verfügbar.',{fontSize:17,color: '#000'}));
        }
        else
        {
            this.ProfitSummary = new ProfitSummary({
                scene: this,
                x: 0,
                y: 0,
                lpSolution: this.mainScene.lpSolution,
                player: this.mainScene.player,
                month: this.mainScene.month.value
            });
            // add the summary to the panel
            this.panel.add(this.ProfitSummary);
        }
        this.fadeIn();
        if (this.mainScene.tutorialPhase) this.panel.buttonRound.disableInteractive();
    }
}

export default MarketDialogue;