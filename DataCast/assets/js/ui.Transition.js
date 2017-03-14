// @file layout.transition.js

define(['jquery'], function ( $ ) {

    //TODO : 트랜지션 테스트
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
        outClass: 'page-moveToTopFade',
        inClass: 'page-rotateUnfoldBottom',
        mode : '1'
    };

    /**
     * 페이지트랜지션
     * @param option
     * @constructor
     */
    function Transition( option ){
        var oAnimEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        };

        this.$warp = $('#l-wrap');
        this.nCurrent = 0;
        this.isAnimating = false;
        this.endCurrPage = false;
        this.endNextPage = false;
        this.activeClassName = 'page-current';
        this.option = $.extend( {}, defaults , option );
        this.animEndEventName = oAnimEndEventNames[ Modernizr.prefixed( 'animation' ) ];

        this.init();
    }


    /**
     * initialize
     */
    Transition.prototype.init = function(){
        var _this = this;
        _this.$pages = _this.$warp.find('>.page');
        _this.nPageLen = _this.$pages.length;

        _this.$pages.each( function (){
            var $page = $( this );
            $page.data( 'originClassList', $page.attr( 'class' ) );
        });
        _this.$pages.eq( _this.nCurrent ).addClass( 'page-current' );
    };


    Transition.prototype.onEndAnimation = function ( $outpage, $inpage , targetIndex ){
        var _this = this;

        _this.nCurrent = targetIndex;
        _this.endCurrPage = false;
        _this.endNextPage = false;

        $outpage.attr( 'class', $outpage.data( 'originClassList' ) );
        $inpage.attr( 'class', $inpage.data( 'originClassList' ) + ' ' + _this.activeClassName );
        _this.isAnimating = false;
    };

    Transition.prototype.go = function( nextPageIndex , styleNum ){
        var _this = this;

        nextPageIndex = nextPageIndex-1;
        if( typeof styleNum == 'undefined' ){
            styleNum = this.option.mode
        }

        if( _this.isAnimating  || ( _this.nCurrent == nextPageIndex ) )  {
            return false;
        }
        _this.isAnimating = true;

        var $currentPage = _this.$pages.eq( _this.nCurrent );
        var $nextPage = _this.$pages.eq( nextPageIndex ).addClass( _this.activeClassName ),
            _outClass = _this.option.outClass,
            _inClass = _this.option.inClass;


        if ( styleNum === 0 ) {
            _this.onEndAnimation( $currentPage, $nextPage , nextPageIndex );
            return
        }

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

    return Transition;
});
