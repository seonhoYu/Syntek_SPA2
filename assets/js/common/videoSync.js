﻿/**
* @file  /common/videoSync.js
* @brief index page multiple video play/pause control
* @see   /css/animation.css
*/

require(["jquery", "signalrhubs"], function($)
{
    var hubUrl = '';
    var isMainBrowser = false;
    $.signalVideo = function (mainBrowser, url) {
        hubUrl = url;
        isMainBrowser = mainBrowser;
        var videoElem = $('#globalVideo');

        $.connection.hub.url = hubUrl;
        var hub = $.connection.video;

        hub.client.startVideo = function () {
            $('.main-content').fadeOut();
            videoElem.fadeIn();
            videoElem[0].play();
        }

        hub.client.stopVideo = function () {
            videoElem[0].pause();
        }

        hub.client.syncVideo = function (time) {
            if (isMainBrowser == false) {
                var result = Math.abs(videoElem[0].currentTime - time)
                if (result > 0.15) {
                    videoElem[0].currentTime = time;
                    console.log("check: " + result);
                };
            }
        }

        hub.client.endVideo = function(){
            videoElem[0].pause();
            videoElem.fadeOut();
            $('.main-content').fadeIn();
        }

        $.connection.hub.start().done(function () {

            videoElem[0].addEventListener("playing", function () {
                if (isMainBrowser) {
                    hub.server.startVideo();
                }
                console.log('playing');
            }, false);

            //video stop
            videoElem[0].addEventListener("pause", function () {
                if (isMainBrowser) {
                    hub.server.stopVideo();
                }
                console.log('pause');
            }, false);

            //send sync 
            videoElem[0].addEventListener("timeupdate", function () {
                if (isMainBrowser) {
                    var vTime = videoElem[0].currentTime;
                    console.log('time : ' + vTime);
                    hub.server.syncVideo(vTime);
                }
            }, false);

            videoElem[0].addEventListener("ended", function () {
                console.log('end');
                hub.server.endVideo();
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

        return hub;
    }
	
	// $('#globalVideo').signalVideo(true ,"http://localhost:8080/signalr");
});