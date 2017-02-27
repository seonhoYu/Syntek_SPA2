/**
* @file  script.js
* @brief Subpage common data/motion control
*/

var environment;
var screenRollNo = 0;
var transitionSpeed = 1000;
var PageTransition;
var PageUiAnimation;
//var animationCallback;


define( ['jquery', 'handlebars', 'contentTransition', 'uiAnimation', 'signalSync'], function ($, Handlebars, Transition, UiAnimation){

    var contents = [];

    $.getJSON("contents.json", function (data) {
        contents = data;
        generateAllContentsHTML(contents);


        $('section.page-content').each(function (idx) {
            var template = $(this).attr('template');
            var list = $('#section' + template);
            var prefix = 'Template/' + template;

            $.get(prefix + "/index.html", function (html) {
                var theTemplate = Handlebars.compile(html);

                $.getJSON(prefix + "/data/data.json").done(function (data) {
                    var compiledHtml = theTemplate(data);
                    list.append(compiledHtml);
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

        PageTransition = new Transition();

        if (environment.screenRoller != undefined && environment.screenRoller.length > 0) {
            transition();
        }
        else {
            PageTransition.test(environment.screenId);
        }
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
		    var param = getUrlParameter('template');
		    if (param == 'pt001') {
		        environment.screenId = 1;
		        environment.isHubDevice = true;
		    }
		    else if (param == 'pt002') {
		        environment.screenId = 2;
		        environment.isHubDevice = false;
		    }

		    $.signalClient(environment.isHubDevice, environment.screenId, environment.videoPlayList, "http://localhost:8080/signalr");

		    PageUiAnimation = new UiAnimation();
		    
		}, 1000);
		
	});

    function generateAllContentsHTML(data) {
        var list = $('.main-content');

        var theTemplateScript = $("#contents-template").html();

        var theTemplate = Handlebars.compile(theTemplateScript);
        list.append(theTemplate(data));
    }

    function transition() {
        if (screenRollNo >= environment.screenRoller.length) {
            screenRollNo = 0;
        }
		
        PageTransition.test(environment.screenRoller[screenRollNo].id, environment.styleNumber);

        clearTimeout(transition);
        setTimeout(transition, environment.screenRoller[screenRollNo].interval + 1000);
        
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

	Handlebars.registerHelper('ifvalue', function (conditional, options) {
	    if (options.hash.value === conditional) {
	        return options.fn(this)
	    } else {
	        return options.inverse(this);
	    }
	});
	
    
});