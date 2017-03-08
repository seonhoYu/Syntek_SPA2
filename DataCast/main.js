require( ['jquery', 'lodash', 'modernizr', 'template', 'uiActivePage', 'modelObserve'], function( $, _ , Modernizr, template , PAGE , OBSERVE){

    /**
     * 시간과 날짜 바인딩
     * 워커에서 1분단위로
     */
    var weatherTimer = function(){

        var timer = new Worker('js/ww.timer.js');
        var $time = $('#weather-time'),
            $days = $('#weather-days');

        timer.onmessage = function(e){
            $time.text( e.data.time );
            $days.text( e.data.days );
        };
    };

    /**
     * 페이지 전환 타이머
     */
    var pageChange = function( initIndex ){
        var page = new Worker('js/ww.pageChange.js');
        var param = $.extend({},window.__DATA.config, {startIdx : initIndex} );

        page.postMessage( JSON.stringify( param ) );
        page.onmessage = function(e){
            console.dir(e.data);
            PAGE.on(e.data);
        };
    };


    /**
     * initialize
     */
    template.init(function(){
        var initPageNumber = 1;
        window.UI = {};
        window.UI.PAGE = PAGE;
        window.UI.OBSERVE = OBSERVE;

        if( location.hash.length ){
            initPageNumber = location.hash.substr(1);
        }
        PAGE.init();
        PAGE.on( initPageNumber, 0 );

        //시계
        weatherTimer();

        //페이지전환타이머
        pageChange( window.UI.PAGE.index );
    });

    window.addEventListener("contextmenu", function (e) {e.preventDefault(); } ,false);
    window.addEventListener("MSHoldVisual", function (e) {e.preventDefault(); } ,false);
    window.addEventListener("MSGestureHold",function (e) {e.preventDefault(); },false );
});
