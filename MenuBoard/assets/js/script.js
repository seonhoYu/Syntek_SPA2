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
    $.getJSON("contents.json", function (data) {
        contents = data;
        generateAllContentsHTML(contents);

        PageVideo = new PageVideoController();

        // global video load
        PageVideo.load("#globalVideo");

        $('section.page-content').each(function (idx) {
            var template = $(this).attr('template');
            var list = $('#section' + template);
            var prefix = 'Template/' + template;

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

    $.getJSON("environment.json", function (data) {
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

        var rollingSetting;
        
        $(environment.screenRoller).each(function (idx, obj) {
            if (obj.target == environment.screenId) {
                rollingSetting = obj;
            }
        });


        PageTransition.start(environment.screenId, environment.styleNumber);
        if (environment.screenRoller != undefined && environment.screenRoller.length > 1) {
            transition(rollingSetting);
        }

        //if (environment.screenRoller != undefined && environment.screenRoller.length > 1) {
        //    transition(rollingSetting);
        //}
        //else {
        //    PageTransition.start(environment.screenId);
        //}
    });

	
	var template = getUrlParameter("template");
	if(template != undefined){
		var list = $('#section1');
		var prefix = 'Template/' + template;

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
	
	$(document).ready(function(){
		setTimeout(function(){
		    
            PageUiAnimation = new UiAnimation();
            PageWeather = new Weather();
            

            $.signalClient(environment.isHubDevice, environment.screenId, environment.videoPlayList, "http://localhost:8080/signalr");
		    
		}, 1000);		
	});

	

    function generateAllContentsHTML(data) {
        var list = $('.main-content');

        var theTemplateScript = $("#contents-template").html();

        var theTemplate = Handlebars.compile(theTemplateScript);
        list.append(theTemplate(data));
    }

    function transition(rollingSetting) {
        //node.js websocket을 통한 타이머를 사용한 경우
        PageCommonTimer = new Timer({
            serverAddress: 'ws://localhost:8989/',
            protocol: 'echo-protocol'

        });

        TimerConnection = PageCommonTimer.connect(
            environment.isHubDevice ? JSON.stringify(environment.screenRoller) : '',
            function (message) {
                var data = JSON.parse(message.data);
                if (environment.screenId == data.target) {
                    PageTransition.start(data.page, environment.styleNumber);
                }
            }
        );

        //단독으로 실행할 경우
        //if (screenRollNo >= rollingSetting.schedule.length) {
        //    screenRollNo = 0;
        //}
		
        //PageTransition.start(rollingSetting.schedule[screenRollNo].id, environment.styleNumber);

        //setTimeout(function () { transition(rollingSetting) }, rollingSetting.schedule[screenRollNo].interval + 1000);
        //clearTimeout(transition);
        
        //screenRollNo++;
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

	Handlebars.registerHelper('ifvalue', function (conditional, options) {
	    if (options.hash.value === conditional) {
	        return options.fn(this)
	    } else {
	        return options.inverse(this);
	    }
	});
});