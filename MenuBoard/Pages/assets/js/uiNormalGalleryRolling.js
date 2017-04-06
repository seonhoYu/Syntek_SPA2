define( ['jquery'], function( $ ){
    var defaults = {
        intervalTime : 5000
    };

    function Gallery ( el, option ){
        this.el = el;
        this.$el = $(el);
        this.option = $.extend( {}, defaults, option );
        this.autoTimer = null;
        this.currIdx = 0;

        this.init();
    }

    Gallery.prototype.init = function(){
        this.$items = this.$el.find('>li');
        this.itemLen = this.$items.length;
        this.$items.eq(0).addClass('active');
    };

    Gallery.prototype.interval = function( remote ){
        var _this = this;

        clearInterval( _this.autoTimer );
        _this.autoTimer = null;

        if( remote ) {

            _this.autoTimer = setInterval(function () {

                _this.$items.removeClass('active').eq(_this.currIdx).addClass('active');
                _this.currIdx++;
                if (_this.currIdx >= _this.itemLen) {
                    _this.currIdx = 0;
                }

            }, _this.option.intervalTime);

        }

    };

    Gallery.prototype.on = function(){
        var _this = this;
        //console.log('포스터갤러리 on ');
        _this.interval( true );
    };

    Gallery.prototype.off = function(){
        var _this = this;
        //console.log('포스터갤러리 off ');
        _this.interval( false );
    };

    return Gallery;

});
