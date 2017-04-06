define( ['jquery'], function( $ ){
    var defaults = {
        stageItems : '.stage-item',
        slideList : '.slideList',
        slideItems : '.slide-item',
        intervalTime : 5000
    };

    function MenuRolling( el, option ){
        var base = this;
        base.el = el;
        base.$el = $( el );
        base.option = $.extend( {}, defaults , option );
        base.$stageItems = base.$el.find( base.option.stageItems );
        base.$slideList = base.$el.find( base.option.slideList );
        base.$slideItems = base.$el.find( base.option.slideItems );
        base.itemLen = base.$slideItems.length;

        base.currIdx = 0;
        base.autoTimer = null;
        base.isAnimating = false;

        this.init();
    }


    MenuRolling.prototype.init = function(){
        var base = this;

        if( base.itemLen >= 3){
            base.$slideItems.last().insertBefore( base.$slideItems.first().addClass('active') );
            base.distance = parseInt( base.$slideItems.width(), 10) + parseInt(base.$slideItems.css('margin-right'),10 )
        }
        base.$stageItems.eq(0).addClass('active');
    };

    MenuRolling.prototype.next = function(){
        var base = this;
        base.currIdx++;
        if( base.currIdx >= base.itemLen ){
            base.currIdx = 0;
        }

        base.isAnimating = true;
        base.$slideItems.removeClass('active');

        base.$slideList.addClass('animating').css({
            '-webkit-transform' : 'translate3d( -'+base.distance+'px,0,0)',
            'transform' : 'translate3d( -'+base.distance+'px,0,0)'
        }).one('transitionend',function(e){

            base.isAnimating = false;
            base.$slideList.find( base.option.slideItems ).eq(0).appendTo( base.$slideList);
            base.$slideList.removeClass('animating').css({
                '-webkit-transform': 'translate3d(0,0,0)',
                'transform': 'translate3d(0,0,0)'
            });

        });

        base.$stageItems.removeClass('active').eq( base.currIdx ).addClass('active');
        base.$slideItems.eq( base.currIdx ).addClass('active');

    };

    MenuRolling.prototype.on = function(){
        var base = this;
        //console.log( ' MenuRolling.prototype.on ');
        clearInterval( base.autoTimer );

        base.autoTimer = null;
        base.autoTimer = setInterval( function(){
            if( !base.isAnimating ){
                base.next();
            }
        }, base.option.intervalTime );

    };

    MenuRolling.prototype.off = function(){
        var base = this;
        //console.log( ' MenuRolling.prototype.off ');
        clearInterval( base.autoTimer );
        base.autoTimer = null;
    };


    return MenuRolling;
});
