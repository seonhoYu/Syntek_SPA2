/**
* @file  /common/uiAnimation.js
* @brief index page multiple animations
* @see   /css/animation.css
*/

define( ['jquery', 'marquee'], function ( $, marquee ){
    
    var animationGrp = {
        1 : 'left-move',
        2 : 'right-move',
        3 : 'cloud-move-left',
        4 : 'cloud-move-right',
        5 : 'snow-flake',
        6 : 'sakura-fall',
        7 : 'leaves-falling',

        100 : 'notice-move-right-top',
        101 : 'notice-move-left-top',
        102 : 'notice-move-relay-top',

        103 : 'notice-move-right-center',
        104 : 'notice-move-left-center',
        105 : 'notice-move-relay-center',

        106 : 'notice-move-right-bottom',
        107 : 'notice-move-left-bottom',
        108 : 'notice-move-relay-bottom',

        110 : 'notice-layer'
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

        _this.animEndEventName = oAnimEndEventNames[ Modernizr.prefixed('animation')];
        _this.animStartEventName = oAnimStartEventNames[ Modernizr.prefixed('animation')];

        _this.$el = $('.ui-animation');
        _this.$id = 'animationNumber';

        _this.init();
    }

    UiAnimation.prototype.init = function(){
        var _this = this;
    };

    UiAnimation.prototype.isNotice = function(aniType){
        var _this = this;

        _this.$notice = _this.$el.find('#notice'),
        _this.$noticeTarget = _this.$el.find('.'+ animationGrp[aniType]);
        _this.$noticeLayer = _this.$el.find('#noticeLayer');

        _this.isNoticeText = animationGrp[aniType].indexOf('notice-move-left') > -1 || animationGrp[aniType].indexOf('notice-move-right') > -1,
        _this.isNoticeRelay = animationGrp[aniType].indexOf('notice-move-relay') > -1,
        _this.isNoticeLayer = animationGrp[aniType].indexOf('notice-layer') > -1;

        return _this.$notice, _this.$noticeTarget, _this.$noticeLayer, _this.isNoticeText, _this.isNoticeRelay, _this.isNoticeLayer;
    };

    UiAnimation.prototype.start = function(aniType, timer, callback) {
        var _this = this,
            $target = _this.$el.find('#' + _this.$id + aniType),
            _callbackTime = _this.$el.find('#' + _this.$id + aniType).data('callback-time') * 1000;


        _this.isNotice(aniType);

        if(_this.isNoticeText){
            if(_this.$notice.is(':hidden')) {
                 _this.$notice.fadeIn();
            }

            if(_this.$noticeTarget.find('.js-marquee').length){
                _this.$noticeTarget.marquee('destroy');
                _this.$notice.children().hide();
            } else {
                _this.$notice.children().hide();
            }

            var innerwidth = _this.$noticeTarget.innerWidth;

            _this.$noticeTarget.fadeIn().width(innerwidth).marquee();

            _this.timer(aniType, timer);

            return;
        }

        if(_this.isNoticeRelay){
            var _callbackTime = _this.$noticeTarget.data('callback-time') * 1000;

            if(_this.$notice.is(':hidden')) {
                 _this.$notice.fadeIn();
            }

            if(_this.$noticeTarget.find('.js-marquee').length){
                _this.$noticeTarget.marquee('destroy');
                _this.$notice.children().hide();
            } else {
                _this.$notice.children().hide();
            }

            var innerwidth = _this.$noticeTarget.innerWidth;

            _this.$noticeTarget.fadeIn().width(innerwidth).marquee().bind('finished', function(){
                 _this.$noticeTarget.marquee('destroy'); 
                 _this.$notice.hide();

                 console.log('end');
            });

            if (callback) {
                setTimeout(function(){
                    callback();
                }, _callbackTime);
            }

            return;
        }

        if(_this.isNoticeLayer){
            if(_this.$noticeLayer.is(':hidden')) {
                 _this.$noticeLayer.fadeIn(function(){
                    $(this).find('.alert').fadeIn();
                 });
            }

            _this.timer(aniType, timer);

            return;

        }

        function CallbackTimeCheck(){
            $target.addClass(animationGrp[aniType]).one(_this.animStartEventName, function(){
                console.log('event start', _callbackTime);

                if (callback) {
                    setTimeout(function(){
                        callback();
                    }, _callbackTime);
                }

            }).one(_this.animEndEventName, function(){
                 $target.removeClass(animationGrp[aniType]);

                 console.log('event end');
            });

            return CallbackTimeCheck;
        }

        switch (aniType) {
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
                _this.timer(aniType, timer);
                _this.SnowAnimationStart(_this.$id + aniType);

                break;

            // Sakura fall
            case 6:
                _this.timer(aniType, timer);

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
                _this.timer(aniType, timer);
                $target.addClass(animationGrp[aniType]);

                var itemHtml = "";

                for(var item = 0; item <= 15; item++){
                    itemHtml += '<span></span>';
                }

                $target.empty().html(itemHtml);

                break;
        }
    };

    UiAnimation.prototype.stop = function (aniType) {
        var _this = this,
            $target = _this.$el.find('#' + _this.$id + aniType);

        _this.isNotice(aniType);

        if(_this.isNoticeText || _this.isNoticeRelay){
            if(_this.$notice.is(':visible')) {
                 _this.$notice.fadeOut(function(){
                    _this.$noticeTarget.marquee('destroy').hide();
                 })
            }

            return;
        }

        if(_this.isNoticeLayer){
            if(_this.$noticeLayer.is(':visible')) {
                 _this.$noticeLayer.fadeOut();
            }

            return;
        }

        switch (aniType) {
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
                _this.timer(aniType);
                $target.children().fadeOut(500, function(){
                     $target.empty();
                });

                break;

            // Sakura fall
            case 6:
                _this.timer(aniType);
                $target.sakura('stop');

                break;

            // leaves fall
            case 7: 
                 _this.timer(aniType);

                $target.children().fadeOut(500, function(){
                    $target.removeClass(animationGrp[aniType])
                    $target.empty();
                });

                break;
        }

        _this.$el.find(_this.$id + aniType).removeClass(animationGrp[aniType])
    };

    UiAnimation.prototype.timer = function(aniType, timer) {
       var _this = this;
       var animationTimeOut = function(){
              _this.stop(aniType);
              console.log('end timer')
           }

       if(timer){
            console.log('start timer')

            var tid = timer * 60000;
            setTimeout(animationTimeOut, tid);
        } else {
            clearTimeout(animationTimeOut);
        }

        return animationTimeOut;
    };

    UiAnimation.prototype.SnowAnimationStart = function(aniType) {
       /* Define the number of snowflakes to be used in the animation */
        var SNOWFLAKES = 200;

        function init() {
            
            /* Fill the empty container with freshly driven snow */
            var first = true;
            for (var i = 0; i < SNOWFLAKES; i++) {
                document.getElementById(aniType).appendChild(createASnowflake(first));
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

            snowflakeElement.style.msAnimationName = 'fade, drop';
            snowflakeElement.style.msAnimationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
            snowflakeElement.style.msAnimationDelay = flakeDelay;

            /* Position the snowflake at a random location along the screen, anchored to either the left or the right*/
            snowflakeElement.style[anchorSide] = randomInteger(0, 60) + '%';

            snowflake.style.webkitAnimationName = spinAnimationName;
            snowflake.style.webkitAnimationDuration = spinDuration;

            snowflake.style.msAnimationName = spinAnimationName;
            snowflake.style.msAnimationDuration = spinDuration;


            /* Return this snowflake element so it can be added to the document */
            return snowflakeElement;
        }

        return init();
    };

    UiAnimation.prototype.textChange = function(aniType, changeText){
        var _this = this;

        _this.isNotice(aniType);

        if(_this.isNoticeText || _this.isNoticeRelay){
            _this.$noticeTarget.empty().html(changeText);
        }

        if(_this.isNoticeLayer){
            _this.$noticeTarget.find('.alert p').empty().html(changeText);
        }
    };

    return UiAnimation;
});
