define(['jquery','lodash','template'], function( $, _ , template){
    var _change, _update, compare;


    /**
     * item length가 변함에 따라, html을 재생성하고, 스크립트를 update
     * @type {{tv: Function, executive: Function, weather: Function}}
     * @private
     */
    _change = {

        'tv' : function( obj ){
            template.dataBinding( obj.module, obj, $('#'+obj.module) );
            window.UI.PAGE.list['1'].TV.update();
        },

        'executive' : function( obj ){
            template.dataBinding( obj.module, obj, $('#'+obj.module) );
            window.UI.PAGE.list['2'].FlipCard.update();
        },

        'weather' : function( obj ){
            template.dataBinding( obj.module, obj, $('#'+obj.module) );

        }
    };

    /**
     * item Length 변화 없이 value 만 변경될 경우
     * @type {{tv: Function, executive: Function}}
     * @private
     */
    _update = {

        'tv' : function( obj ){

            _.forEach( obj, function( item ){
                var $item = $('#tv-item-'+item.id);

                $item.data({
                    time : item.RotationTime,
                    type : item.FileType
                });

                $item.find('.tv-item-atom').attr('src', item.FilePath );
                $item.find('.tv-item_subtitle > p').text( item.Subtitle );
            });

        },

        'executive' : function( obj ){
            var _status = {
                '001' : '재실',
                '002' : '부재',
                '003' : '회의',
                '004' : '출장',
                '005' : '휴가'
            };

            _.forEach( obj, function( item ){
                var $member = $('#executive'+item.id).find('.member');
                $member.removeClass().addClass('member member-'+item.ExecutiveStatus).find('.status').html(_status[item.ExecutiveStatus])
            });
        }
    };


    /**
     * 변화가 있다고 요청된 JSON모듈을 가져와 현재 데이터와 비교
     * 갯수의 변화가 있으면 _change 함수, value의 변화가 있으면 _update 콜
     * @param moduleName
     */
    compare = function( moduleName ){
        var ww = new Worker('js/ww.jsonCompare.js');

        $.getJSON('../data/'+moduleName+'.json').done(function( newObj ){
            ww.postMessage(JSON.stringify({
                module : moduleName,
                oldObj : window.__DATA[moduleName],
                newObj : newObj
            }));
        });

        ww.onmessage = function(e){
            var obj = JSON.parse(e.data);

            //갯수변화
            if( obj.method == 'change'){
                _change[obj.module]( obj.newData );
                window.__DATA[obj.module] = obj.newData;
            }

            //프로퍼티 변화
            if( obj.method == 'update' ){
                _update[obj.module]( obj.updateTarget );
                window.__DATA[obj.module] = obj.newData;
            }
        }
    };

    return compare;
});
