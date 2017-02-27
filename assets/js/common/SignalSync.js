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
    var videoPlayList;
    var currentScreenId;
    $.signalClient = function (mainBrowser, screenId, videoList, url) {
        hubUrl = url;
        isMainBrowser = mainBrowser;
        currentScreenId = screenId;
        videoPlayList = videoList;
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

        //비디오 시작
        videoHub.client.startVideo = function (videoId) {
            $(videoPlayList).each(function (idx) {
                if (this.groupId == videoId) {
                    $(this.list).each(function (innerIdx) {
                        if (this.id == currentScreenId) {
                            videoElem[0].setAttribute('src', this.src);
                            pageContent.fadeOut();
                            videoElem.fadeIn();
                            videoElem[0].play();
                        }
                    })
                }
            })
        }

        //비디오 정지
        videoHub.client.stopVideo = function () {
            videoElem[0].pause();
        }

        //메인 영상에 하위 display 시간 Sync
        videoHub.client.syncVideo = function (time) {
            if (isMainBrowser == false) {
                var result = Math.abs(videoElem[0].currentTime - time)
                if (result > 0.15) {
                    videoElem[0].currentTime = time;
                    console.log("check: " + result);
                };
            }
        }

        //메인 영상 종료 시 하위 영상 종료
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
        });
    }
});