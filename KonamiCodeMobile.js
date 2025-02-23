/*:
 * @plugindesc Enables the Konami Code in RPG Maker MV with mobile support via touch screen and device buttons.
 * @author theNBeXperience
 * 
 * @help
 * This plugin listens for the classic Konami Code:
 * Up, Up, Down, Down, Left, Right, Left, Right, B, A
 * On mobile devices, it uses touch gestures and hardware buttons.
 * 
 * When the correct code is entered, a switch is activated.
 * 
 * @param SwitchID
 * @text Switch ID
 * @desc The ID of the switch to activate when the Konami Code is entered.
 * @type switch
 * @default 1
 */

(function () {
    var parameters = PluginManager.parameters("KonamiCodePlugin");
    var switchId = Number(parameters["SwitchID"] || 1);

    var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var inputSequence = [];

    document.addEventListener("keydown", function (event) {
        inputSequence.push(event.keyCode);
        if (inputSequence.toString().indexOf(konamiCode.toString()) !== -1) {
            activateKonamiSwitch();
        }
        if (inputSequence.length > 10) inputSequence.shift();
    });

    function activateKonamiSwitch() {
        inputSequence = [];
        if ($gameSwitches) {
            $gameSwitches.setValue(switchId, true);
        }
    }

    if (Utils.isMobileDevice()) {
        setupTouchGestures();
    }

    function setupTouchGestures() {
        var touchSequence = [];
        var touchMap = {
            "swipeUp": 38,
            "swipeDown": 40,
            "swipeLeft": 37,
            "swipeRight": 39,
            "tapB": 66,
            "tapA": 65
        };

        var startX, startY, endX, endY;

        document.addEventListener("touchstart", function (event) {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        });

        document.addEventListener("touchend", function (event) {
            endX = event.changedTouches[0].clientX;
            endY = event.changedTouches[0].clientY;
            var diffX = endX - startX;
            var diffY = endY - startY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) touchSequence.push(touchMap["swipeRight"]);
                else if (diffX < -50) touchSequence.push(touchMap["swipeLeft"]);
            } else {
                if (diffY > 50) touchSequence.push(touchMap["swipeDown"]);
                else if (diffY < -50) touchSequence.push(touchMap["swipeUp"]);
            }

            if (touchSequence.toString().indexOf(konamiCode.toString()) !== -1) {
                activateKonamiSwitch();
            }
            if (touchSequence.length > 10) touchSequence.shift();
        });
    }
})();