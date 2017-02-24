/**
* @file  /common/uiAnimation.js
* @brief index page multiple animations
* @see   /css/animation.css
*/

define( ['jquery'], function ( $ ){
    
    var animationGrp = {
        1 : 'left-move',
        2 : 'right-move'
    }

    var oAnimEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };

    function UiAnimation (el, option){
        var _this = this;

        _this.animEndEventName = oAnimEndEventNames[ Modernizr.prefixed( 'animation' ) ];

        _this.$el = $(".ui-animation");

        _this.init();
    }

    UiAnimation.prototype.init = function(){
        var _this = this;
    };

    UiAnimation.prototype.start = function(aniNumber, callback) {
        var _this = this;

        _this.$el.find("#" + "animationNumber" + aniNumber).addClass(animationGrp[aniNumber]).one(_this.animEndEventName, function(){
            $(this).removeClass(animationGrp[aniNumber]);
            if (callback) {
                callback();
            }
        })    
    };

    UiAnimation.prototype.stop = function(aniNumber) {
        var _this = this;

        _this.$el.find("#" + "animationNumber" + aniNumber).removeClass(animationGrp[aniNumber])
    };

    UiAnimation.prototype.controller = function(aniNumber) {

    };

    return UiAnimation;
});
