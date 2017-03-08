/**
* @file  /common/playVideoPlayer.js
* @brief Subpage video list load/play/pause control 
*/

define( ['jquery'], function ( $ ){
    function PageVideoController ( el, option ){
        var that = this;
    }

    PageVideoController.prototype.load = function(content){
        var that = this;

        $(content).find("source").each(function(){
            var _url = $(this).data("src");

            $(this).attr("src", _url);
        })
    };

    PageVideoController.prototype.play = function() {
        var that = this;
    };

    PageVideoController.prototype.on = function() {
        var that = this;
        //console.log( 'PageVideoController.prototype.on ');
        //that.play();
    };

    PageVideoController.prototype.off = function() {
        var that = this;
        //console.log( 'PageVideoController.prototype.off ');
        //that.video.pause();
    };


    return PageVideoController;
});
