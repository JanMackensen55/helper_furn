
/**
 * A class to nest html form elements into the game.
 * @author William Clarkson ({@link https://williamclarkson.net/})
 */

class FormUtil {
    constructor(config) {
        //super();
        this.scene = config.scene;

        //get the game height and width
        this.gameWidth=this.scene.game.config.width;
        this.gameHeight=this.scene.game.config.height;
    }

    scaleToGameW(elName, per) {
        var el = document.getElementById(elName);
        var w = this.gameWidth * per;
        el.style.width = w + "px";
    }
    scaleToGameH(elName, per) {
        var el = document.getElementById(elName);
        var h = this.gameHeight * per;
        el.style.height = h + "px";
    }
    placeElementAt(x,y, elName, centerX = true, centerY = false) {
        //get the element
        var el = document.getElementById(elName);
        //set the position to absolute
        el.style.position = "absolute";
        //get the width of the element
        var w = el.style.width;
        //convert to a number
        w = this.toNum(w);

        //center horizontal in square if needed
        if (centerX == true) {
            x -= w / 2;
        }
        //
        //get the height
        //        
        var h = el.style.height;
        //convert to a number
        h = this.toNum(h);
        //
        //center verticaly in square if needed
        //
        if (centerY == true) {
            y -= h / 2;
        }
        //set the positions
        el.style.top = y + "px";
        el.style.left = x + "px";
    }
    toNum(s) {
        s = s.replace("px", "");
        s = parseInt(s);
        return s;
    }
    addChangeCallback(elName, fun, scope = null) {
        var el = document.getElementById(elName);
        if (scope == null) {
            el.onchange = fun;
        } else {
            el.onchange = fun.bind(scope);
        }
    }
    getTextAreaValue(elName)
    {
        var el = document.getElementById(elName);
        return el.value;
    }

    /**
     * Prevent the text area from being resized.
     * @author Eric Frodl
     * @param {String} elName the id of the textarea.
     */
    disableResize(elName)
    {
        let el = document.getElementById(elName);
        el.style.resize = 'none';
    }

    /**
     * Sets the provided textarea to visible
     * @author Eric Frodl
     * @param {String} elName the id of the textarea.
     */
    showTextArea(elName)
    {
        let el = document.getElementById(elName);
        el.style.display = 'block';
    }

    /**
     * Hides the text area.
     * @author Eric Frodl
     * @param {String} elName the id of the textarea to hide.
     */
    hideTextArea(elName)
    {
        let textarea = document.getElementById(elName);
        textarea.style.display = 'none';
    }

}

export default FormUtil;