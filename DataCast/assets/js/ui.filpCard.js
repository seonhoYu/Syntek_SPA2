//uiFilpCard

define( ['jquery','lodash'], function( $, _ ){

    var timer = null;

    var defaults = {
        itemClassName : 'executive-item',
        frontClassName : 'front',
        backClassName : 'back',
        showItemLen : 9,
        durationSec : 10
    };

    function Card( el, option ){
        this.el = el;
        this.$el = $(el);
        this.option = $.extend( {}, defaults, option );
        this.init();
    }

    Card.prototype.init = function(){
        this.$item = this.$el.find('.'+ this.option.itemClassName );
        this.itemLen = this.$item.length;
        this.pageLen = Math.ceil(this.itemLen / this.option.showItemLen);
        this.pageIdx = -1;

        this.$item.addClass('back');
    };

    Card.prototype.change = function( staticIndex ){

        //var base = this;
        //var _targetPage = base.pageIdx+1;
        //if( typeof staticIndex != 'undefined' ){
        //    _targetPage = staticIndex;
        //}
        //if( _targetPage >= base.pageLen ){
        //    _targetPage = 0;
        //}
        //var _rangeStart = _targetPage * base.option.showItemLen,
        //    _rangeEnd = _rangeStart + base.option.showItemLen;

        //base.$item.addClass('back').slice( _rangeStart, _rangeEnd ).removeClass('back');
        //base.pageIdx = _targetPage;
    };

    Card.prototype.update = function(){
        this.$item.addClass('back');
        this.init();
        if( UI.PAGE.index == 2){
            this.on();
        }
    };

    Card.prototype.on = function () {
        var base = this,
            _duration = base.option.durationSec * 1000;

        clearInterval(timer);

        if( base.pageLen > 1 ){
            timer = setInterval(function(){
                base.change();
            }, _duration);
        }
        base.change(0);
    };

    Card.prototype.off = function(){
        clearInterval(timer);
        timer = null;
    };

    return Card;
});
