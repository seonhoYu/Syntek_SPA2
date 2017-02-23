// config.js
require.config({
    baseUrl: '',
    paths: {
        jquery : 'assets/js/vendor/jquery-3.1.1.min',
        modernizr : 'assets/js/vendor/modernizr-2.8.3.min',
        lodash : 'assets/js/vendor/lodash.min',
        handlebars : 'assets/js/vendor/handlebars.min',

        tweenMax : 'assets/js/vendor/TweenMax-1.19.0.min',
        contentTransition : 'assets/js/common/transitions',
        pageVideoPlayer : 'assets/js/common/pageVideoPlayer',
        commonScript : 'assets/js/script',

        // template js add
        templateJs : 'Template/assets/js/main',
		
		//signalR
		signalrcore : 'assets/js/vendor/jquery.signalR-2.2.1.min',
		signalrhubs : 'http://localhost:8080/signalr/hubs?',
		videoSync : 'assets/js/common/videoSync'
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
		"videoSync" : {
			deps: ["signalrhubs"],
		},
        'templateJs' : ['commonScript']
    }
});