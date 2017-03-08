// @file uiActivePage.js
// Dependency [ main.js ]
define(['jquery','lodash','uiTransition', 'uiSS', 'uiFlipCard'], function( $, _, Transition , SS , FlipCard ){

    var _beforePageIdx = null;
    var _initPage = 1;
    var transition;

    var page = {

        init : function(){
            var _data = window.__DATA;

            //트랜지션 생성
            transition = new Transition({
                'mode' : _data.config.transitionType
            });


            //페이지 모듈에 따라 스크립트 바인딩
            $('.page').each(function(index){
                var _this = this,
                    $this = $(this);
                var _moduleName = $this.data('module'),
                    _pageList = page.list[index+1] = {} ;

                ({
                    'tv' : function(){
                        _pageList.TV = new SS( _this , {
                            mode : window.__DATA.tv.transitionMode
                        });
                    },

                    'executive' : function(){
                        _pageList.FlipCard = new FlipCard( _this ,{
                            durationSec : window.__DATA.executive.transitionSec
                        });
                    }
                })[_moduleName]();

            });
        },

        on : function( targetPageIdx, isAnimation ){
            var _this = this;
            _initPage = targetPageIdx || _beforePageIdx || 1;

            //console.log(_initPage + 'PAGE START');

            //현재페이지와 이전페이지가 같으면 중지
            if( _beforePageIdx == _initPage ){
             //   return false;
            }

            //이전페이지 스크립트들 off
            if( _beforePageIdx != _initPage ){
                _.forEach( _this.list[_beforePageIdx] , function( item ){
                    item.off();
                });
            }

            //새로운페이지 스크립트들 on
            _.forEach( _this.list[_initPage] , function( item ){
                item.on();
            });

            _beforePageIdx = _initPage;
            _this.index = _initPage;
            transition.go( _initPage, isAnimation );
        },

        reset : function(){
            var _this = this;
            _.forEach( _this.list[_beforePageIdx] , function( item ){
                item.off();
            });
//            console.log(_beforePageIdx + ' PAGE RESET');
        },

        list : {},

        index : 1

    };



    return page;

});
