/**
* @file  /common/videoSync.js
* @brief index page multiple video play/pause control
* @see   /css/animation.css
*/

var aniHub;
var videoHub;

require(["jquery", "signalrhubs"], function($)
{
    var hubUrl = '';
    var isMainBrowser = false;
    var currentScreenId;
    $.signalClient = function (mainBrowser, screenId, url) {
        hubUrl = url;
        isMainBrowser = mainBrowser;
        currentScreenId = screenId;
        var videoElem = $('#globalVideo');
        var pageContent = $('.main-content > .page-content');

        $.connection.hub.url = hubUrl;
        

        aniHub = $.connection.animation;

        aniHub.client.startAnimation = function (screenId, animationNo) {
            if (currentScreenId == screenId) {
                PageUiAnimation.start(animationNo, function () {
                    aniHub.server.startAnimation(screenId + 1, animationNo);
                });
            }
        }

        aniHub.client.stopAnimation = function () {
            PageUiAnimation.stop(animationNo);
        }


        videoHub = $.connection.video;
        videoHub.client.startVideo = function () {
            pageContent.fadeOut();
            videoElem.fadeIn();
            videoElem[0].play();
        }

        videoHub.client.stopVideo = function () {
            if (isMainBrowser == false) {
                videoElem[0].pause();
            }
        }

        videoHub.client.syncVideo = function (time) {
            if (isMainBrowser == false) {
                var result = Math.abs(videoElem[0].currentTime - time)
                if (result > 0.15) {
                    videoElem[0].currentTime = time;
                    console.log("check: " + result);
                };
            }
        }

        videoHub.client.endVideo = function () {
            if (mainBrowser == false) {
                videoElem[0].pause();
            }
            videoElem.fadeOut();   
            pageContent.fadeIn();
        }

        $.connection.hub.start().done(function () {

            videoElem[0].addEventListener("playing", function () {
                if (isMainBrowser) {
                    videoHub.server.startVideo();
                }
                console.log('playing');
            }, false);

            //video stop
            videoElem[0].addEventListener("pause", function () {
                if (isMainBrowser) {
                    videoHub.server.stopVideo();
                }
                console.log('pause');
            }, false);

            //send sync 
            videoElem[0].addEventListener("timeupdate", function () {
                if (isMainBrowser) {
                    var vTime = videoElem[0].currentTime;
                    console.log('time : ' + vTime);
                    videoHub.server.syncVideo(vTime);
                }
            }, false);

            videoElem[0].addEventListener("ended", function () {
                if (isMainBrowser) {
                    console.log('end');
                    videoHub.server.endVideo();
                }
            }, false);

            //get src 다른비디오를 load 
            //getBtn.addEventListener("click", getSrc);
            //function getSrc() {
            //    var src = "Video/" + document.getElementById('fileName').value;
            //    video.src = src;
            //    sync.server.clientToServerSrc(src);
            //    video.play();
            //}
        });
    }
	
	// $('#globalVideo').signalVideo(true ,"http://localhost:8080/signalr");
});