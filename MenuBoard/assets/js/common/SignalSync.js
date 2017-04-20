/**
* @file  /common/SignalSync.js
*/

var aniHub;
var videoHub;
var noticeHub;
var menuHub;
var transitionHub;

require(["jquery", "signalrhubs"], function($){
    var hubUrl = '';
    var isMainBrowser = false;
    var videoPlayList;
    var currentScreenId;

    function GetMenuList(obj, stack) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object") {
                    if (property == "Menu") {
                        return obj[property];
                    }
                    else {
                        GetMenuList(obj[property], stack + '.' + property);
                    }
                }
            }
        }
    }

    $.signalClient = function (mainBrowser, screenId, videoList, url) {
        hubUrl = url;
        isMainBrowser = mainBrowser;
        currentScreenId = screenId;
        videoPlayList = videoList;
        var videoElem = $('#globalVideo');
        var pageContent = $('.main-content > .page-content');

        $.connection.hub.url = hubUrl;
        
        aniHub = $.connection.animation;

        aniHub.client.startAnimation = function (screenId, animationNo, direction, timer) {
            if (currentScreenId == screenId) {
                PageUiAnimation.start(animationNo, timer, function () {
                    var nextId;
                    if (direction == 1) {
                        nextId = screenId + 1;
                    }
                    else if(direction == 2){
                        nextId = screenId - 1;
                    }
                    if (nextId > 0) {
                        aniHub.server.startAnimation(nextId, animationNo, direction, timer);
                    }
                });
            }
            else if (screenId == 0 || direction == 0) {
                PageUiAnimation.start(animationNo, timer);
            }
        }

        aniHub.client.stopAnimation = function (animationNo) {
            if (animationNo == 0) {
                $.each(PageUiAnimation.$activeAnimation, function(idx, obj){
                    PageUiAnimation.stop(obj);
                });
                PageUiAnimation.$activeAnimation = [];

                $.each(PageUiAnimation.$activeTimeouts, function (idx, obj) {
                    clearTimeout(obj);
                });
                PageUiAnimation.$activeTimeouts = [];
            }
            else {
                PageUiAnimation.stop(animationNo);
            }
        }

        videoHub = $.connection.video;

        videoHub.client.getVideoList = function () {
            if (isMainBrowser) {
                videoHub.server.sendVideoList(videoList);
            }
        }

        //비디오 시작
        videoHub.client.startVideo = function (videoId) {
            $(videoPlayList).each(function (idx) {
                if (this.groupId == videoId) {
                    $(this.list).each(function (innerIdx) {
                        if (this.id == currentScreenId) {
                            videoElem[0].setAttribute('src', this.src);
                            videoElem[0].load();
                            videoElem[0].oncanplay = function () {
                                pageContent.fadeOut();
                                videoElem.fadeIn();
                                videoElem[0].play();
                            }
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
            //if (mainBrowser == false) {
                
            //}
            videoElem[0].pause();
            videoElem.fadeOut();   
            pageContent.fadeIn();
        }

        noticeHub = $.connection.notice;
        
        noticeHub.client.showNotice = function (type, text, screenId, timer) {
            var animationNo = 100;
            switch (type) {
                case 2: animationNo = 101; break;
                case 3: animationNo = 102; break;
                case 4: animationNo = 103; break;
                case 5: animationNo = 104; break;
                case 6: animationNo = 105; break;
                case 7: animationNo = 106; break;
                case 8: animationNo = 107; break;
                case 9: animationNo = 108; break;
                case 10: animationNo = 110; break;
            }

            PageUiAnimation.textChange(animationNo, text);

            if (currentScreenId == screenId) {
                PageUiAnimation.start(animationNo, timer, function () {
                    if (animationNo == 102 || animationNo == 105 || animationNo == 108) {
                        var nextId = screenId + 1;
                        aniHub.server.startAnimation(nextId, animationNo, 1, timer);
                    }
                });
            }
        }

        noticeHub.client.hideNotice = function () {
            aniHub.server.stopAnimation();
        }

        menuHub = $.connection.menu;

        menuHub.client.getMenuMeta = function (screenId, menuId) {
            
            if (currentScreenId == screenId) {
                debugger;
                //TO DO : ScreenId 룰에 대해 수정해야 함(현재 임시 처리함)
                $.getJSON("../pt00" + screenId + "/data/data.json").done(function (data) {
                    var menus = GetMenuList(data, '');
                    $.each(menus, function (idx) {
                        if (menus[idx].Id == menuId) {
                            menuHub.server.sendMenuData(screenId, menuId, menus[idx]);
                            return;
                        }
                    });
                });
            }
        }

        


        menuHub.client.updateMenuData = function (screenId, menuId, data) {
            if (currentScreenId == screenId) {
                var menuEl = $('#sectionPT00' + screenId).find('[menu-Id=' + menuId + ']');
                debugger;
                for (var property in data) {
                    $(menuEl).find('[data-id=' + property + ']').text(data[property]);
                }
            }
        }

        transitionHub = $.connection.transition;
        transitionHub.client.changePage = function (screenId, page, effectId) {
            debugger;
            if (currentScreenId == screenId) {
                PageTransition.start(page, effectId);
            }
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