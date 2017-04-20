define( ['jquery'], function ( $ ){
    var defaults = {

    };

    function VideoPlayer ( el, option ){
        var _this = this;

        _this.el = el;
        _this.$el = $( el );
        _this.option = $.extend( {}, defaults, option );

        _this.video = _this.$el.find('video').get(0);
        _this.$list = _this.$el.find('.video-playlist');

        _this.init();
    }

    VideoPlayer.prototype.init = function(){
        var _this = this;

        _this.currIdx = 0;
        _this.$items = _this.$list.find('>li');
        _this.itemLen = _this.$items.length;

        $( _this.video ).off('ended').on({
            'ended' : function() {
                //console.log('-비디오 끝-');
                _this.currIdx++;
                _this.play();
            }
        });
    };

    VideoPlayer.prototype.play = function() {
        var _this = this;

        if (_this.itemLen <= 0) {
            return;
        }

        if( _this.currIdx >= _this.itemLen ){
            _this.currIdx = 0;
        }
        //console.log( 'next' + _this.currIdx + '번 영상 플레이 ');
        _this.video.src = _this.$items.eq( _this.currIdx ).data('src');
        _this.video.play();
    };

    VideoPlayer.prototype.on = function() {
        var _this = this;
        //console.log( 'VideoPlayer.prototype.on ');
        _this.play();
    };

    VideoPlayer.prototype.off = function() {
        var _this = this;
        //console.log( 'VideoPlayer.prototype.off ');
        _this.video.pause();
    };


    return VideoPlayer;
});
