/**
* @file  script.js
* @brief Subpage common data/motion control
*/

var environment;
var screenRollNo = 0;
var transitionSpeed = 1000;
var PageTransition;
var PageUiAnimation;
var PageWeather;
var PageVideo;
var PageCommonTimer, TimerConnection;



define(['jquery', 'handlebars', 'contentTransition', 'uiAnimation', 'pageVideoPlayer', 'weather', 'commonTimer', 'signalSync'], function ($, Handlebars, Transition, UiAnimation, PageVideoController, Weather, Timer) {
    
    var contents = [];
    var transitionInLocal = false;
    var transitionCnt = 0;
    var transitionInitCnt = 100;

    $.getJSON("../../contents.json", function (data) {
        contents = data;
        generateAllContentsHTML(contents);

        PageVideo = new PageVideoController();

        // global video load
        PageVideo.load("#globalVideo");

        $('section.page-content').each(function (idx) {
            var template = $(this).attr('template');
            var list = $('#section' + template);
            var prefix = '../../Pages/' + template;

            $.get(prefix + "/index.html", function (html) {
                var theTemplate = Handlebars.compile(html);

                $.getJSON(prefix + "/data/data.json").done(function (data) {
                    var compiledHtml = theTemplate(data);
                    list.append(compiledHtml);

                    // video load
					PageVideo.load(list);
                })
                .fail(function () {
                    var convertedHtml = html;
                    list.append(convertedHtml);
                });
            });
        })
    });

    $.getJSON("../../environment.json", function (data) {
        environment = data;

        var param = getUrlParameter('template');
        if (param == 'pt001') {
            environment.screenId = 1;
            environment.isHubDevice = true;
        }
        else if (param == 'pt002') {
            environment.screenId = 2;
            environment.isHubDevice = false;
        }
        else if (param == 'pt003') {
            environment.screenId = 3;
            environment.isHubDevice = false;
        }
        else if (param == 'pt004') {
            environment.screenId = 4;
            environment.isHubDevice = false;
        }

        PageTransition = new Transition();
        PageTransition.start(environment.screenId, environment.styleNumber);
        
    });

	
	var template = getUrlParameter("template");
	if(template != undefined){
		var list = $('#section1');
		var prefix = '../../Pages/' + template;

		$.get(prefix + "/index.html", function (html) {
			var theTemplate = Handlebars.compile(html);

			$.getJSON(prefix + "/data/data.json").done(function (data) {
				var compiledHtml = theTemplate(data);
				list.append(compiledHtml);
			})
			.fail(function () {
				list.append(html);
			});
		});
	} 
	
	$(document).ready(function () {
        setTimeout(function(){
		    
            PageUiAnimation = new UiAnimation();
            PageWeather = new Weather();
            
            connectToTimerServer();

            $.signalClient(environment.isHubDevice, environment.screenId, environment.videoPlayList, "http://localhost:8080/signalr");
		    
		}, 1000);		
	});

	

    function generateAllContentsHTML(data) {
        var list = $('.main-content');

        var theTemplateScript = $("#contents-template").html();

        var theTemplate = Handlebars.compile(theTemplateScript);
        list.append(theTemplate(data));
    }

    function transitionLocal() {
        var rollingSetting;

        $(environment.screenRoller).each(function (idx, obj) {
            if (obj.target == environment.screenId) {
                rollingSetting = obj;
            }
        });

        if (screenRollNo >= rollingSetting.schedule.length) {
            screenRollNo = 0;
        }

        PageTransition.start(rollingSetting.schedule[screenRollNo].id, environment.styleNumber);
        
        setTimeout(function () { transitionLocal() }, rollingSetting.schedule[screenRollNo].interval + 1000);
        clearTimeout(transitionLocal);

        screenRollNo++;
    }

	function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

	function connectToTimerServer() {
	    PageCommonTimer = new Timer({
	        serverAddress: 'ws://localhost:8989/',
	        protocol: 'echo-protocol'
	    });
	    TimerConnection = PageCommonTimer.connect(
            timerOpenFn,
            timerReceiveFn,
            function(){
                transitionInLocal = true;
                transitionLocal();
            }
            
        );
	}

	function timerOpenFn() {
	    transitionInLocal = false;
	    if (environment.isHubDevice) {
	        PageCommonTimer.send('schedule', JSON.stringify(environment.screenRoller));
	    }
	}

    //Timer 에서 리턴된 메시지를 처리하는 함수
	function timerReceiveFn(message) {
	    var data = JSON.parse(message.data);
	    if (environment.screenId == data.target) {
	        PageTransition.start(data.page, environment.styleNumber);

	        if (environment.isHubDevice && transitionCnt > transitionInitCnt) {
	            transitionCnt = 0;
	            PageCommonTimer.send('schedule', JSON.stringify(environment.screenRoller));
	            return;
	        }

	        transitionCnt++;
	    }
	}

	Handlebars.registerHelper('ifvalue', function (conditional, options) {
	    if (options.hash.value === conditional) {
	        return options.fn(this)
	    } else {
	        return options.inverse(this);
	    }
	});
});