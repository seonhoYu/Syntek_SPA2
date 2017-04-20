/**
* @file  /common/uiAnimation.js
* @brief index page multiple animations
* @see   /css/animation.css
*/

define( ['jquery', 'marquee', 'sakura'], function ( $, marquee, sakura  ){
    
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

    function UiAnimation (el, option ){
        var that = this;

        that.animEndEventName = oAnimEndEventNames[ Modernizr.prefixed('animation')];
        that.animStartEventName = oAnimStartEventNames[ Modernizr.prefixed('animation')];

        that.$el = $('.ui-animation');
        that.$id = 'animationNumber';

        that.init();
    }

    UiAnimation.prototype.init = function(){
        var that = this;
        that.$activeAnimation = [];
        that.$activeTimeouts = [];
    };

    UiAnimation.prototype.isNotice = function( aniType ){
        var that = this;

        that.$notice = that.$el.find('#notice'),
        that.$noticeTarget = that.$el.find('.'+ animationGrp[aniType]);
        that.$noticeLayer = that.$el.find('#noticeLayer');

        that.isNoticeText = animationGrp[aniType].indexOf('notice-move-left') > -1 || animationGrp[aniType].indexOf('notice-move-right') > -1;
        that.isNoticeRelay = animationGrp[aniType].indexOf('notice-move-relay') > -1;
        that.isNoticeLayer = animationGrp[aniType].indexOf('notice-layer') > -1;

        return that.$notice, that.$noticeTarget, that.$noticeLayer, that.isNoticeText, that.isNoticeRelay, that.isNoticeLayer;
    };



    UiAnimation.prototype.start = function( aniType, timer, callback ) {
        var that = this,
            $target = that.$el.find('#' + that.$id + aniType),
            _callbackTime = that.$el.find('#' + that.$id + aniType).data('callback-time') * 1000;


        that.isNotice(aniType);

        if( that.isNoticeText ){
            if( that.$notice.is(':hidden') ) {
                 that.$notice.fadeIn();
            }

            if( that.$noticeTarget.find('.js-marquee').length ){
                that.$noticeTarget.marquee('destroy');
                that.$notice.children().hide();
            } else {
                that.$notice.children().hide();
            }

            var innerwidth = that.$noticeTarget.innerWidth;

            that.$noticeTarget.fadeIn().width(innerwidth).marquee();

            that.timer(aniType, timer);

            return;
        }

        if( that.isNoticeRelay ){
            var _callbackTime = that.$noticeTarget.data('callback-time') * 1000;

            if( that.$notice.is(':hidden') ) {
                 that.$notice.fadeIn();
            }

            if( that.$noticeTarget.find('.js-marquee').length ){
                that.$noticeTarget.marquee('destroy');
                that.$notice.children().hide();
            } else {
                that.$notice.children().hide();
            }

            var innerwidth = that.$noticeTarget.innerWidth;

            that.$noticeTarget.fadeIn().width(innerwidth).marquee().bind('finished', function(){
                 that.$noticeTarget.marquee('destroy'); 
                 that.$notice.hide();

                 console.log('end');
            });

            if ( callback ) {
                setTimeout(function(){
                    callback();
                }, _callbackTime);
            }

            return;
        }

        if( that.isNoticeLayer ){
            if( that.$noticeLayer.is(':hidden') ) {
                 that.$noticeLayer.fadeIn(function(){
                    $(this).find('.alert').fadeIn();
                 });
            }

            that.timer(aniType, timer);

            return;

        }

        function CallbackTimeCheck(){
            $target.addClass(animationGrp[aniType]).one(that.animStartEventName, function(){
                console.log('event start', _callbackTime);

                if ( callback ) {
                    var nextCall = setTimeout(function(){
                        callback();
                    }, _callbackTime);
                    that.$activeTimeouts.push(nextCall);
                }

            }).one(that.animEndEventName, function(){
                 $target.removeClass(animationGrp[aniType]);

                 console.log('event end');
            });

            return CallbackTimeCheck;
        }

        that.$activeAnimation.push(aniType);
        switch ( aniType ) {
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

                for( var item = 0; item <= 4; item++ ){
                    itemHtml += '<div class="cloud cloud-move-left'+(item+1)+'"></div>';
                }

                $target.empty().html(itemHtml);

                break;

            // Cloud moving right
            case 4:
                CallbackTimeCheck();

                var itemHtml = "";

                for( var item = 0; item <= 4; item++ ){
                    itemHtml += '<div class="cloud cloud-move-right'+(item+1)+'"></div>';
                }

                $target.empty().html(itemHtml);

                break;

            // Snow fall
            case 5:
                that.timer(aniType, timer);
                that.SnowAnimationStart(that.$id + aniType);

                break;

            // Sakura fall
            case 6:
                that.timer(aniType, timer);

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
                that.timer(aniType, timer);
                $target.addClass(animationGrp[aniType]);

                var itemHtml = "";

                for( var item = 0; item <= 15; item++ ){
                    itemHtml += '<span></span>';
                }

                $target.empty().html(itemHtml);

                break;
        }
    };

    UiAnimation.prototype.stop = function (aniType ) {
        var that = this,
            $target = that.$el.find('#' + that.$id + aniType);

        that.isNotice(aniType);

        if( that.isNoticeText || that.isNoticeRelay ){
            if( that.$notice.is(':visible') ) {
                 that.$notice.fadeOut(function(){
                    that.$noticeTarget.marquee('destroy').hide();
                 })
            }

            return;
        }

        if( that.isNoticeLayer ){
            if( that.$noticeLayer.is(':visible') ) {
                 that.$noticeLayer.fadeOut();
            }

            return;
        }

        function CallbackTimeCheck() {
            _callbackTime = that.$el.find('#' + that.$id + aniType).data('callback-time') * 1000;
            $target.addClass(animationGrp[aniType]).one(that.animStartEventName, function () {
                console.log('event start', _callbackTime);

                //if (callback) {
                //    setTimeout(function () {
                //        callback();
                //    }, _callbackTime);
                //}

            }).one(that.animEndEventName, function () {
                $target.removeClass(animationGrp[aniType]);

                console.log('event end');
            });

            return CallbackTimeCheck;
        }

        switch ( aniType ) {
            // left start moving
            case 1:
                $target.empty();
                //CallbackTimeCheck();

                break;

             // right start moving
            case 2:
                $target.empty();
                //CallbackTimeCheck();

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
                that.timer(aniType);
                $target.children().fadeOut(500, function(){
                     $target.empty();
                });

                break;

            // Sakura fall
            case 6:
                that.timer(aniType);
                $target.sakura('stop');

                break;

            // leaves fall
            case 7: 
                 that.timer(aniType);

                $target.children().fadeOut(500, function(){
                    $target.removeClass(animationGrp[aniType])
                    $target.empty();
                });

                break;
        }

        that.$el.find(that.$id + aniType).removeClass(animationGrp[aniType])
    };

    UiAnimation.prototype.timer = function( aniType, timer ) {
       var that = this,
           animationTimeOut = function(){
              that.stop(aniType);
              console.log('end timer')
           }

       if( timer ){
            console.log('start timer')

            var tid = timer * 60000;
            setTimeout(animationTimeOut, tid);
        } else {
            clearTimeout(animationTimeOut);
        }

        return animationTimeOut;
    };

    UiAnimation.prototype.SnowAnimationStart = function( aniType ) {
       /* Define the number of snowflakes to be used in the animation */
        var SNOWFLAKES = 200;

        function init() {
            
            /* Fill the empty container with freshly driven snow */
            var first = true;
            for ( var i = 0; i < SNOWFLAKES; i++ ) {
                document.getElementById(aniType).appendChild(createASnowflake(first));
                first = false;
            }
        }
        
        /*
            Receives the lowest and highest values of a range and
            returns a random integer that falls within that range.
        */
        function randomInteger( low, high ) {
            return low + Math.floor(Math.random() * (high - low));
        }

        /*
           Receives the lowest and highest values of a range and
           returns a random float that falls within that range.
        */
        function randomFloat( low, high ) {
            return low + Math.random() * (high - low);
        }

        function randomItem( items ) {
            return items[randomInteger(0, items.length - 1)]
        }

        /* Returns a duration value for the falling animation.*/
        function durationValue( value ) {
            return value + 's';
        }

        function createASnowflake( is_first ) {
            var flakes = ['2746', '2745', '2744', '2733'],
                superFlakes = ['2746', '2745', '2744', 'fc7', '274b', '2749', '2747', '2746', '273c', '273b', '2734', '2733', '2732', '2731', '2725'],
                sizes = ['tiny', 'tiny', 'tiny', 'small', 'small', 'small', 'small', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'large', 'massive'],
                snowflakeElement = document.createElement('div'),
                snowflake = document.createElement('span'),
                spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpin',
                anchorSide = (Math.random() < 0.5) ? 'left' : 'right',
                fadeAndDropDuration = durationValue(randomFloat(5, 11)),
                spinDuration = durationValue(randomFloat(4, 8)),
                flakeDelay = is_first ? 0 : durationValue(randomFloat(0, 10));


            
            snowflakeElement.className = 'snow-flake-item ' + randomItem(sizes);
            snowflake.innerHTML = '&#x' + randomItem(flakes) + ';';
            snowflakeElement.appendChild(snowflake);

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

    UiAnimation.prototype.textChange = function( aniType, changeText ){
        var that = this;

        that.isNotice(aniType);

        if( that.isNoticeText || that.isNoticeRelay ){
            that.$noticeTarget.empty().html(changeText);
        }

        if( that.isNoticeLayer ){
            that.$noticeTarget.find('.alert p').empty().html(changeText);
        }
    };

    return UiAnimation;
});
