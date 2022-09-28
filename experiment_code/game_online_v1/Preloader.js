import { disableNextButton } from './SosciWriter.js';
import { ON_LOCAL_MACHINE } from './Constants.js';

/**
 * @classdesc
 * This class ensures that all graphical elements are loaded before the start of the game.
 * 
 * @class Preloader
 * @extends Phaser.Scene
 * 
 */
export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super({ 
            key:'preloader',
            pack: {files: [
                {
                    type: 'image',
                    key: 'logo',
                    url: 'logo.png'
                }
            ]}
        });
    }

    init()
    {
        if (!ON_LOCAL_MACHINE){
            // hide the next button of the SosciSurvey website.
            disableNextButton();
        }
    }
    
    /**
     * loads all elements and displays the progress in a loading bar
     */
    preload()
    {
        this.add.image(400,300,'logo');
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 430, 320, 50);
        this.load.on('progress', function(value)
        {
            progressBar.clear();
            progressBar.fillStyle(0xffffff,1);
            progressBar.fillRect(250,440,300*value,30);
        });
        // Map
        this.load.image('tiles-medival', 'RTS_medieval2-ex.png');
        this.load.image('tiles-scifi', 'scifi_tilesheet2-ex.png');
        this.load.tilemapTiledJSON('map', 'furniture_company_map.xml');

        //Buildings
        this.load.image('workshop-a', 'workshop-a.png');
        this.load.image('workshop-b', 'workshop-b.png');
        this.load.image('workshop-c', 'workshop-c.png');
        this.load.image('workshop-d', 'workshop-d.png');
        this.load.image('management_one', 'management_a.png');
        this.load.image('management_two', 'management_b.png');
        this.load.image('market', 'market.png');
        this.load.image('storage', 'storage.png');
        this.load.image('sign1', 'sign1.png');
        this.load.image('sign2', 'sign2.png');
        this.load.image('sign-a', 'Sign_legs.png');
        this.load.image('sign-b', 'sign_b.png');
        this.load.image('sign-c', 'sign_c.png');
        this.load.image('sign-d', 'sign_d.png');

        // Items
        this.load.image('wood', 'wood_item.png');
        this.load.image('metal', 'iron.png');
        this.load.image('gold', 'gold.png');
        this.load.image('chair', 'chair.png');
        this.load.image('chair-leg', 'chair_leg.png');
        this.load.image('chair-back', 'chair_back.png');
        this.load.image('table', 'table.png');
        this.load.image('table-leg', 'table_leg.png');
        this.load.image('table-top', 'table_top.png');
        this.load.image('bed', 'bed.png');
        this.load.image('bed-frame', 'bed_frame.png');
        this.load.image('bed-top', 'bed_top.png');
        this.load.image('bookcase', 'shelf.png');
        this.load.image('bookcase-leg', 'shelf_leg.png');
        this.load.image('bookcase-top', 'shelf_top.png');

        // UI elements
        this.load.image('panel', 'panel_brown.png');
        this.load.image('panel-long', 'panel_long_beige.png');
        this.load.image('panel-contents', 'contents.png');
        this.load.image('panel-white', 'panelWhite.png');
        this.load.image('round-button', 'buttonRound_blue.png');
        this.load.image('cross', 'iconCross_beige.png');
        this.load.image('button-green', 'button_green.png');
        this.load.image('button-green-pressed', 'button_green_pressed.png');
        this.load.image('notes', 'notes_white.png');
        this.load.image('ui-panel', 'upper_border.png');
        this.load.image('tooltip', 'tooltip.png');
        this.load.image('tooltip-right', 'tooltip_right_arr.png');
        this.load.image('panel-blue', 'panel_blue.png');
        this.load.image('arrow_up', 'grey_arrowUpWhite.png');
        this.load.image('arrow_down', 'grey_arrowDownWhite.png');
        this.load.image('no_changes', 'minus.png');
        this.load.image('part-display', 'partDisplay.png');
        this.load.image('button-square', 'button_square.png');
        this.load.image('button-square-unpressed', 'button_square_unpressed.png');
        this.load.image('button-long', 'buttonLong_blue.png');
        this.load.image('button-long-pressed', 'buttonLong_blue_pressed.png');
        this.load.image('wrench', 'wrench.png');
        this.load.image('right', 'right.png');
        this.load.image('left', 'left.png');
        this.load.image('shadow-background', 'ShadowSummary.png');
        this.load.image('newspaper', 'newspaper.png');
        this.load.image('radio-button', 'grey_circle.png');
        this.load.image('radio-button-checked', 'blue_boxTick.png');
        this.load.image('audio-on', 'audio_on.png');
        this.load.image('audio-off', 'audio_off.png');
        this.load.image('arrow-right', 'arrowRight.png');
        this.load.image('banner', 'banner.png');

        // Avatars
        this.load.image('ann', 'ann.png');
        this.load.image('mike', 'mike.png');

        // Medals
        this.load.image('medal-perfect', 'medal_perfect.png');
        this.load.image('medal-very-good', 'medal_very_good.png');
        this.load.image('medal-good', 'medal_good.png');
        this.load.image('medal-hammer', 'medal_hammer.png');

        // Progress bar
        this.load.image('left-cap-shadow', 'barShadowLeft.png');
        this.load.image('middle-shadow', 'barShadowMiddle.png');
        this.load.image('right-cap-shadow', 'barShadowRight.png');
        this.load.image('left-cap', 'barLeft.png');
        this.load.image('right-cap', 'barRight.png');
        this.load.image('middle', 'barMiddle.png');
        this.load.image('left-cap-blue', 'barLeftBlue.png');
        this.load.image('right-cap-blue', 'barRightBlue.png');
        this.load.image('middle-blue', 'barMiddleBlue.png');
        // Vertical bar resources
        this.load.image('vertical_shadow_top', 'bar_vertical_shadow_top.png');
        this.load.image('vertical_shadow_mid', 'bar_vertical_shadow_mid.png');
        this.load.image('vertical_shadow_bottom', 'bar_vertical_shadow_bottom.png');
        this.load.image('vertical_blue_top', 'bar_vertical_blue_top.png');
        this.load.image('vertical_blue_mid', 'bar_vertical_blue_mid.png');
        this.load.image('vertical_blue_bottom', 'bar_vertical_blue_bottom.png');
        this.load.image('vertical_green_top', 'bar_vertical_green_top.png');
        this.load.image('vertical_green_mid', 'bar_vertical_green_mid.png');
        this.load.image('vertical_green_bottom', 'bar_vertical_green_bottom.png');

        // Load Fonts
        this.load.bitmapFont('black_font', 'pressstart.png', 'pressstart.xml');
        this.load.bitmapFont('white_font', 'pressstart_white.png', 'pressstart_white.xml');
        this.load.bitmapFont('red_font', 'pressstart_red.png', 'pressstart_red.xml');

        // Load Sounds
        this.load.audio('click', [ 'switch_001.ogg', 'switch_001.mp3' ]);
        this.load.audio('error', [ 'error_004.ogg', 'error_004.mp3' ]);
        this.load.audio('month_change', [ 'drop_004.ogg', 'drop_004.mp3' ]);
        this.load.audio('coins', [ 'coins.ogg', 'coins.mp3']);

        
    }

    create()
    {
        this.scene.start('main');
    }
    
}