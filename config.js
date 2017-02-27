/**
* @file config.js
* @brief require config setting
*/

require.config({
    baseUrl: '',
    paths: {
        jquery : 'assets/js/vendor/jquery-3.1.1.min',
        modernizr : 'assets/js/vendor/modernizr-2.8.3.min',
        lodash : 'assets/js/vendor/lodash.min',
        handlebars : 'assets/js/vendor/handlebars.min',

        tweenMax : 'assets/js/vendor/ui/TweenMax-1.19.0.min',
        sakura : 'assets/js/vendor/ui/jquery-sakura.min',
        contentTransition : 'assets/js/common/transitions',
		uiAnimation : 'assets/js/common/animations',
        pageVideoPlayer : 'assets/js/common/pageVideoPlayer',
        commonScript : 'assets/js/script',

        // template js add
        templateJs : 'Template/assets/js/main',
		templateCommonJs : 'Template/assets/js/common',
		
		//signalR
		signalrcore: 'assets/js/vendor/jquery.signalR-2.2.1',
		signalrhubs : 'http://localhost:8080/signalr/hubs?',
		signalSync: 'assets/js/common/SignalSync'
    },

    shim : {
		"jquery": {
			exports: "$"
		},
		"signalrcore": {
			deps: ["jquery"],
			exports: "$.connection"
		},
		"signalrhubs": {
			deps: ["signalrcore"],
		},
		"signalSync": {
			deps: ["signalrhubs"],
		},

		"sakura" : ['jquery'],
		"templateJs": ['commonScript'],
		"templateCommonJs": ["commonScript"]
    }
});