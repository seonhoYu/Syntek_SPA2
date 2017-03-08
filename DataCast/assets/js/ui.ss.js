// @file uiScreenSaver.js
// Dependency [ main.js ]

define(['jquery', 'lodash'],function( $ , _ ){

    var transitionGrp = {
        1 : {
            outClass: 'page-moveToTop',
            inClass: 'page-moveFromBottom'
        },
        2 : {
            outClass: 'page-moveToBottom',
            inClass: 'page-moveFromTop'
        },
        3: {
            outClass: 'page-fade',
            inClass: 'page-moveFromBottom page-ontop'
        },
        4 : {
            outClass: 'page-fade',
            inClass: 'page-moveFromTop page-ontop'
        },

        5 : {
            outClass: 'page-moveToTopFade',
            inClass: 'page-moveFromBottomFade'
        },
        6 : {
            outClass: 'page-moveToBottomFade',
            inClass: 'page-moveFromTopFade'
        },
        7 : {
            outClass: 'page-moveToTopEasing page-ontop',
            inClass: 'page-moveFromBottom'
        },

        8 : {
            outClass: 'page-moveToBottomEasing page-ontop',
            inClass: 'page-moveFromTop'
        },
        9 : {
            outClass: 'page-scaleDown',
            inClass: 'page-moveFromBottom page-ontop'
        },
        10 : {
            outClass: 'page-scaleDown',
            inClass: 'page-moveFromTop page-ontop'
        },
        11 : {
            outClass: 'page-scaleDown',
            inClass: 'page-scaleUpDown page-delay300'
        },
        12  :{
            outClass: 'page-scaleDownUp',
            inClass: 'page-scaleUp page-delay300'
        },
        13 : {
            outClass: 'page-moveToTop page-ontop',
            inClass: 'page-scaleUp'
        },
        14 : {
            outClass: 'page-moveToBottom page-ontop',
            inClass: 'page-scaleUp'
        },
        15 : {
            outClass: 'page-scaleDownCenter',
            inClass: 'page-scaleUpCenter page-delay400'
        },
        16 : {
            outClass: 'page-rotateTopSideFirst',
            inClass: 'page-moveFromTop page-delay200 page-ontop'
        },
        17 : {
            outClass: 'page-rotateBottomSideFirst',
            inClass: 'page-moveFromBottom page-delay200 page-ontop'
        },
        18 : {
            outClass: 'page-flipOutTop',
            inClass: 'page-flipInBottom page-delay500'
        },

        19 : {
            outClass: 'page-flipOutBottom',
            inClass: 'page-flipInTop page-delay500'
        },

        20 : {
            outClass: 'page-rotateFall page-ontop',
            inClass: 'page-scaleUp'
        },

        21 : {
            outClass: 'page-rotateOutNewspaper',
            inClass: 'page-rotateInNewspaper page-delay500'
        },

        22 : {
            outClass: 'page-rotatePushTop',
            inClass: 'page-moveFromBottom'
        },

        23 : {
            outClass: 'page-rotatePushBottom',
            inClass: 'page-moveFromTop'
        },

        24 : {
            outClass: 'page-rotatePushTop',
            inClass: 'page-rotatePullBottom page-delay180'
        },

        25 : {
            outClass: 'page-rotatePushBottom',
            inClass: 'page-rotatePullTop page-delay180'
        },

        26 : {
            outClass: 'page-rotateFoldTop',
            inClass: 'page-moveFromBottomFade'
        },

        27 : {
            outClass: 'page-rotateFoldBottom',
            inClass: 'page-moveFromTopFade'
        },

        28 : {
            outClass: 'page-moveToBottomFade',
            inClass: 'page-rotateUnfoldTop'
        },

        29 : {
            outClass: 'page-moveToTopFade',
            inClass: 'page-rotateUnfoldBottom'
        },

        30 : {
            outClass: 'page-rotateRoomTopOut page-ontop',
            inClass: 'page-rotateRoomTopIn'
        },

        31 : {
            outClass: 'page-rotateRoomBottomOut page-ontop',
            inClass: 'page-rotateRoomBottomIn'
        },

        32  : {
            outClass: 'page-rotateCubeTopOut page-ontop',
            inClass: 'page-rotateCubeTopIn'
        },

        33 : {
            outClass: 'page-rotateCubeBottomOut page-ontop',
            inClass: 'page-rotateCubeBottomIn'
        },
        34 : {
            outClass: 'page-rotateCarouselTopOut page-ontop',
            inClass: 'page-rotateCarouselTopIn'
        },

        35 : {
            outClass: 'page-rotateCarouselBottomOut page-ontop',
            inClass: 'page-rotateCarouselBottomIn'
        },

        36 : {
            outClass: 'page-rotateSidesOut',
            inClass: 'page-rotateSidesIn page-delay200'
        },

        37 : {
            outClass: 'page-rotateSlideOut',
            inClass: 'page-rotateSlideIn'
        }
    };

    var defaults = {
        itemClassName : 'tv-item',
        lifeCycleTime : 100000,
        itemDurationTime : {
            html : 10,
            image : 5,
            video : 5,
            etc : 10
        },
        mode : 4
    };

    /**
     * 스크린세이버
     * @param el
     * @param option
     * @constructor
     */
    function ScreenSaver( el, option ){
        var oAnimEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        };


        this.$el = $( el).find('#tv');
        this.isAnimating = false;
        this.endCurrPage = false;
        this.endNextPage = false;
        this.activeClassName = 'page-current';
        this.option = $.extend( {}, defaults, option );
        this.animEndEventName = oAnimEndEventNames[ Modernizr.prefixed( 'animation' ) ];

        this.init();
    }

    ScreenSaver.prototype.init = function(){
        var base = this;

        base.oldIndex = 0;
        base.newIndex = 0;

        base.itemTypes = [];
        base.initFlag = true;
        base.timer = {
            item : null
        };
        base.$items = base.$el.find('.' + base.option.itemClassName );
        base.itemLen = base.$items.length;

        $.each( base.$items, function( index ){
            var $this = $( this );
            base.itemTypes[index] = $this.data('type').toLowerCase();
            $this.data( 'originClassList', $this.attr( 'class' ) );
        });
    };

    /*
     * 스크린세이버를OFF시키기전에,
     * Item루프를 중단하고, 재생중인 영상도 정지시킴
     */
    ScreenSaver.prototype.itemLoopStop = function(){
        var base = this;

        clearTimeout( base.timer.item );
        base.timer.item = null;

        base.$items.find('video').each(function(){
            $(this).get(0).pause();
        });
    };

    /*
     * Item의 타입에 따른 실행부
     */
    ScreenSaver.prototype.itemChange = function( target_index ){
        var base = this;

        var _index, _target, _type, _duration;

        target_index = ( typeof target_index == 'undefined' ) ? 0 : target_index;

        _index =  ( target_index >= base.itemLen ) ? 0 : target_index;
        _target = base.$items.eq( _index );
        _type = base.itemTypes[ _index ];
        _duration = _target.data('time') || base.option.itemDurationTime[ _type ];
        _duration = _duration*1000;

        clearTimeout( base.timer.item );
        base.timer.item = null;
        console.log( _index );
        base.go( _index );
/*

        ({
            'html': function () {

                var hasVideo = false,
                    video = null;

                var checkVideo = function(){
                    $(this).off('load.iframe');
                    if( $(this).attr('src') == 'about:blank' ){
                        //console.info('['+_index +'] iframe SRC Empty');
                        return false;
                    }
                    var $video = _target.find('iframe').contents().find('video');
                    hasVideo = !!$video.length;

                    if(hasVideo){
                        video = $video.get(0);
                        video.src = video.src || video.currentSrc;
                        video.play();
                        //console.info('['+_index +'] iframe Video Play ' + video.src );
                    }
                };
                //checkVideo();
                _target.find('iframe').off('load.iframe').on('load.iframe',checkVideo);

                base.timer.item = setTimeout( function(){
                    //base.oldIndex = _index;
                    //base.newIndex = _index+1;
                    base.itemChange( _index+1 );
                    if(hasVideo){
                        video.pause();
                        //console.info('['+_index +'] iframe Video Stop ' + video.src );
                    }
                }, _duration );
            },

            'image' : function(){
                this.html();
            },

            'video' : function(){
                var videoEl = _target.find('video').get(0);
                videoEl.src = videoEl.src;
                videoEl.play();

                $( videoEl ).off('ended').on({
                    'ended' : function() {
                        //base.oldIndex = _index;
                        //base.newIndex = _index+1;
                        base.itemChange( _index+1 );
                    }
                });

            }
        })[_type]();
*/

        (function(){
            var strWidth = base._getStrWidth( _target.find('.tv-item_subtitle').text() );
            var marqueeSpeed = parseInt( strWidth / 100 );

            if(strWidth == 0){
                _target.find('.tv-item_subtitle').hide();
            } else {
                marqueeSpeed = (marqueeSpeed < 10 ) ? 10 : marqueeSpeed;
                _target.find('.tv-item_subtitle').show().width( strWidth+'px' )
                    .find('p').css({
                    '-webkit-animation': 'marquee '+ marqueeSpeed +'s linear infinite',
                    '-ms-animation': 'marquee '+ marqueeSpeed +'s linear infinite',
                    'animation': 'marquee '+ marqueeSpeed +'s linear infinite'
                });
            }

            //_target.siblings().removeClass('page-current').find('p').css({
            //    '-webkit-animation': 'marquee 0s linear infinite',
            //    '-ms-animation': 'marquee 0s linear infinite',
            //    'animation': 'marquee 0s linear infinite'
            //});
        })();
    };


    ScreenSaver.prototype._getStrWidth = function( str, font ){
        var f = font || '45px',
            o = $('<div>' + str + '</div>')
                .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font-size': f})
                .appendTo($('body')),
            w = o.width();
        o.remove();
        return w;
    };

    /**
     * TV콘텐츠 SRC 변경
     * @param $targetPage
     * @param method
     */
    ScreenSaver.prototype.contentSrcToggle = function( $targetPage, method ){
        var $contents = $targetPage.find('.tv-item-atom');
        var isFrameTag = $contents[0].tagName.toLowerCase() == 'iframe';

        if(method.toLowerCase() == 'on'){
            $contents.attr('src', $contents.data('src') );
        } else {
            if( isFrameTag ){
                $contents.attr('src','about:blank');
            } else {
                $contents.attr('src', '');
            }
        }
    };

    ScreenSaver.prototype.go = function( nextPageIndex ){
        var _this = this;
        if( _this.isAnimating )  {
            console.log( '_this.isAnimating : '+ _this.isAnimating);
            return false;
        }


        var $currentPage = _this.$items.eq( nextPageIndex-1 );
        var $nextPage = _this.$items.eq( nextPageIndex ).addClass( _this.activeClassName );
        var styleNum = this.option.mode;

        //console.log( '_this.oldIndex  '+ _this.oldIndex);
        //console.log( 'nextPageIndex'+ nextPageIndex );
        //nextPageIndex =  ( nextPageIndex >= _this.itemLen ) ? 0 : nextPageIndex;



        if( _this.initFlag  ){

            console.log( '최초로딩' );
            _this.targetPlay( nextPageIndex );
            //_this.onEndAnimation( $currentPage, $nextPage , nextPageIndex );
            _this.initFlag = false;

            return false;
        }

        _this.isAnimating = true;


        if ( styleNum === 0 ) {
            _this.onEndAnimation( $currentPage, $nextPage , nextPageIndex );
            return
        }


        _this.contentSrcToggle( $nextPage, 'on');
        console.log('['+ nextPageIndex+ '] ON ');
        _this.targetPlay( nextPageIndex );
        setTimeout(function(){
            _this.contentSrcToggle( $currentPage, 'off');
            console.log('['+ (nextPageIndex-1)+ '] OFF ');
        },2000);




        $currentPage.addClass( transitionGrp[styleNum].outClass ).one( _this.animEndEventName, function() {
            _this.endCurrPage = true;
            if( _this.endNextPage ) {
                _this.onEndAnimation( $currentPage, $nextPage , nextPageIndex );
            }
        });

        $nextPage.addClass( transitionGrp[styleNum].inClass ).one( _this.animEndEventName, function() {
            _this.endNextPage = true;
            if( _this.endCurrPage ) {
                _this.onEndAnimation( $currentPage, $nextPage , nextPageIndex );
            }
        });
    };

    ScreenSaver.prototype.targetPlay =function( targetIndex ){
        var _this = this;
        var _target = _this.$items.eq( targetIndex );
        var _type = _this.itemTypes[ targetIndex ];
        var _duration = _target.data('time') || _this.option.itemDurationTime[ _type ];
        _duration = _duration*1000;

        ({
            'html': function () {
                console.log( 'onEndAnimation : html ' +  targetIndex );
                var hasVideo = false,
                    video = null;

                var checkVideo = function(){
                    console.log('checkVideo');
                    $(this).off('load');
                    if( $(this).attr('src') == 'about:blank' ){
                        return false;
                    }
                    var $video = _target.find('iframe').contents().find('video');
                    hasVideo = !!$video.length;

                    if(hasVideo){
                        video = $video.get(0);
                        video.src = video.src || video.currentSrc;
                        video.play();
                    }

                };

                if( _type == 'html' ){
                    console.log('html load check');
                    console.log( '_this.initFlag : '+ _this.initFlag);
                    //if( _this.initFlag ){
                        console.log('init checkiframe')
                        _target.find('iframe').on('load',checkVideo);
                    //} else {
//                        checkVideo();
  //                  }
                }

                _this.timer.item = setTimeout( function(){
                    _this.itemChange( targetIndex+1 );
                    if(hasVideo){
                        video.pause();
                    }
                }, _duration );
            },

            'image' : function(){

                this.html();
            },

            'video' : function(){
                console.log( 'onEndAnimation : video ' +  targetIndex );
                var videoEl = _target.find('video').get(0);
                videoEl.src = videoEl.src;
                videoEl.play();

                $( videoEl ).on({
                    'ended' : function() {
                        $(this).off('ended');
                        _this.itemChange( targetIndex+1 );
                    }
                });

            }
        })[_type]();
    };

    ScreenSaver.prototype.onEndAnimation = function ( $outpage, $inpage , targetIndex ){
        var _this = this;

        _this.endCurrPage = false;
        _this.endNextPage = false;

        $outpage.attr( 'class', $outpage.data( 'originClassList' ) );
        $inpage.attr( 'class', $inpage.data( 'originClassList' ) + ' ' + _this.activeClassName );

        _this.isAnimating = false;
    };


    ScreenSaver.prototype.update = function(){
        this.off();
        this.init();

        if( UI.PAGE.index == 1){
            this.on();
        }
    };

    ScreenSaver.prototype.on = function(){
        var base = this;
        base.itemChange();
    };

    ScreenSaver.prototype.off = function(){
        var base = this;
        base.itemLoopStop();
    };

    var console = {
        log : function(){},
        info : function(){},
        error : function(){}
    };

    return ScreenSaver;
});
