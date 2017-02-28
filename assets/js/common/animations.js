/**
* @file  /common/uiAnimation.js
* @brief index page multiple animations
* @see   /css/animation.css
*/

define( ['jquery'], function ( $ ){
    
    var animationGrp = {
        1 : 'left-move',
        2 : 'right-move',
        3 : 'cloud-move-left',
        4 : 'cloud-move-right',
        5 : 'snow-flake',
        6 : 'sakura-fall',
        7 : 'leaves-falling',
    }

    var oAnimEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };

    var oAnimStartEventNames = {
        'WebkitAnimation' : 'webkitAnimationStart',
        'OAnimation' : 'oAnimationStart',
        'msAnimation' : 'MSAnimationStart',
        'animation' : 'animationstart'
    };

    function UiAnimation (el, option){
        var _this = this;

        _this.animEndEventName = oAnimEndEventNames[ Modernizr.prefixed( 'animation' ) ];
        _this.animStartEventName = oAnimStartEventNames[ Modernizr.prefixed( 'animation' ) ];

        _this.$el = $(".ui-animation");
        _this.$id = 'animationNumber';
        _this.init();
    }

    UiAnimation.prototype.init = function(){
        var _this = this;
    };

    UiAnimation.prototype.start = function(aniNumber, timer, callback) {
        var _this = this;
        var $target = _this.$el.find("#" + _this.$id + aniNumber);
        var _callbackTime = _this.$el.find("#" + _this.$id + aniNumber).data("callback-time") * 1000;

        function CallbackTimeCheck(){
            $target.addClass(animationGrp[aniNumber]).one(_this.animStartEventName, function(){
                console.log("event start", _callbackTime);

                if (callback) {
                    setTimeout(function(){
                        callback();
                    }, _callbackTime);
                }

            }).one(_this.animEndEventName, function(){
                 $target.removeClass(animationGrp[aniNumber]);

                 console.log("event end");
            });

            return CallbackTimeCheck;
        }

        switch (aniNumber) {
            // left start moving
            case 1:
                CallbackTimeCheck();

                break;

             // right start moving
            case 2:
                CallbackTimeCheck();

                break;

            // Cloud moving left
            case 3:
                CallbackTimeCheck();

                var itemHtml = "";

                for(var item = 0; item <= 4; item++){
                    itemHtml += '<div class="cloud cloud-move-left'+(item+1)+'"></div>';
                }

                $target.empty().html(itemHtml);

                break;

            // Cloud moving right
            case 4:
                CallbackTimeCheck();

                var itemHtml = "";

                for(var item = 0; item <= 4; item++){
                    itemHtml += '<div class="cloud cloud-move-right'+(item+1)+'"></div>';
                }

                $target.empty().html(itemHtml);

                break;

            // Snow fall
            case 5:
                _this.timer(aniNumber, timer);
                _this.SnowAnimationStart(_this.$id + aniNumber);

                break;

            // Sakura fall
            case 6:
                _this.timer(aniNumber, timer);

                $target.sakura('start', {
                    blowAnimations: [
                        'blow-soft-right'
                    ],                   // Horizontal movement animation names
                    className: 'sakura', // Class name to use
                    fallSpeed: 2,        // Factor for petal fall speed
                    maxSize: 20,         // Maximum petal size
                    minSize: 15,          // Minimum petal size
                    newOn: 300          // Interval after which a new petal is added
                });

                break;
                
            // leaves fall
            case 7: 
                _this.timer(aniNumber, timer);
                $target.addClass(animationGrp[aniNumber]);

                var itemHtml = "";

                for(var item = 0; item <= 15; item++){
                    itemHtml += '<span></span>';
                }

                $target.empty().html(itemHtml);

                break;
        }
    };

    UiAnimation.prototype.stop = function (aniNumber) {
        var _this = this;
        var $target = _this.$el.find("#" + _this.$id + aniNumber);

        switch (aniNumber) {
            // left start moving
            case 1:
                CallbackTimeCheck();

                break;

             // right start moving
            case 2:
                CallbackTimeCheck();

                break;

            // Cloud moving left
            case 3:
                $target.empty();

                break;

            // Cloud moving right
            case 4:
                $target.empty();

                break;

            // Snow fall
            case 5:
                _this.timer(aniNumber);
                $target.children().fadeOut(500, function(){
                     $target.empty();
                });

                break;

            // Sakura fall
            case 6:
                _this.timer(aniNumber);
                $target.sakura('stop');

                break;

            // leaves fall
            case 7: 
                 _this.timer(aniNumber);

                $target.children().fadeOut(500, function(){
                    $target.removeClass(animationGrp[aniNumber])
                    $target.empty();
                });

                break;
        }

        _this.$el.find(_this.$id + aniNumber).removeClass(animationGrp[aniNumber])
    };

    UiAnimation.prototype.timer = function(aniNumber, timer) {
       console.log("start timer")
       var _this = this;
       var animationTimeOut = function(){
              _this.stop(aniNumber);
              console.log("end timer")
           }

       if(timer){
            var tid = timer * 60000;
            setTimeout(animationTimeOut, tid);
        } else {
            clearTimeout(animationTimeOut);
        }

        return animationTimeOut;
    };

    UiAnimation.prototype.SnowAnimationStart = function(aniNumber) {
       /* Define the number of snowflakes to be used in the animation */
        var SNOWFLAKES = 200;

        function init() {
            
            /* Fill the empty container with freshly driven snow */
            var first = true;
            for (var i = 0; i < SNOWFLAKES; i++) {
                document.getElementById(aniNumber).appendChild(createASnowflake(first));
                first = false;
            }
        }
        
        /*
            Receives the lowest and highest values of a range and
            returns a random integer that falls within that range.
        */
        function randomInteger(low, high) {
            return low + Math.floor(Math.random() * (high - low));
        }

        /*
           Receives the lowest and highest values of a range and
           returns a random float that falls within that range.
        */
        function randomFloat(low, high) {
            return low + Math.random() * (high - low);
        }

        function randomItem(items) {
            return items[randomInteger(0, items.length - 1)]
        }

        /* Returns a duration value for the falling animation.*/
        function durationValue(value) {
            return value + 's';
        }

        function createASnowflake(is_first) {
            var flakes = ['2746', '2745', '2744', '2733'];
            var superFlakes = ['2746', '2745', '2744', 'fc7', '274b', '2749', '2747', '2746', '273c', '273b', '2734', '2733', '2732', '2731', '2725'];
            var sizes = ['tiny', 'tiny', 'tiny', 'small', 'small', 'small', 'small', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'large', 'massive'];

            /* Start by creating a wrapper div, and an empty span  */
            var snowflakeElement = document.createElement('div');
            snowflakeElement.className = 'snow-flake-item ' + randomItem(sizes);

            var snowflake = document.createElement('span');
            snowflake.innerHTML = '&#x' + randomItem(flakes) + ';';

            snowflakeElement.appendChild(snowflake);

            /* Randomly choose a spin animation */
            var spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpin';

            /* Randomly choose a side to anchor to, keeps the middle more dense and fits liquid layout */
            var anchorSide = (Math.random() < 0.5) ? 'left' : 'right';

            /* Figure out a random duration for the fade and drop animations */
            var fadeAndDropDuration = durationValue(randomFloat(5, 11));

            /* Figure out another random duration for the spin animation */
            var spinDuration = durationValue(randomFloat(4, 8));

            // how long to wait before the flakes arrive
            var flakeDelay = is_first ? 0 : durationValue(randomFloat(0, 10));

            snowflakeElement.style.webkitAnimationName = 'fade, drop';
            snowflakeElement.style.webkitAnimationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
            snowflakeElement.style.webkitAnimationDelay = flakeDelay;

            /* Position the snowflake at a random location along the screen, anchored to either the left or the right*/
            snowflakeElement.style[anchorSide] = randomInteger(0, 60) + '%';

            snowflake.style.webkitAnimationName = spinAnimationName;
            snowflake.style.webkitAnimationDuration = spinDuration;


            /* Return this snowflake element so it can be added to the document */
            return snowflakeElement;
        }

        return init();
    };

    return UiAnimation;
});
