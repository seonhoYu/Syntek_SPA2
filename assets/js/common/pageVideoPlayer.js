/**
* @file  /common/playVideoPlayer.js
* @brief Subpage video list load/play/pause control 
*/

define( ['jquery'], function ( $ ){
    function PageVideoController ( el, option ){
        var _this = this;
    }

    PageVideoController.prototype.load = function(content){
        var _this = this;

        $(content).find("video").each(function(){
            var $target = $(this).find("source");
            var _url = $target.data("src");

            $target.attr("src", _url);
        })
    };

    PageVideoController.prototype.play = function() {
        var _this = this;
    };

    PageVideoController.prototype.on = function() {
        var _this = this;
        //console.log( 'PageVideoController.prototype.on ');
        //_this.play();
    };

    PageVideoController.prototype.off = function() {
        var _this = this;
        //console.log( 'PageVideoController.prototype.off ');
        //_this.video.pause();
    };


    return PageVideoController;
});
