// @file template.js
// Dependency [ main.js ]
define( ['jquery', 'lodash' ],  function( $, _  ){
    var _init, _render, dataBinding, reInit;

    _init = function(){
        var jsonPath = 'data/';
        return ($.when(
            $.getJSON( jsonPath+'config.json' ),
            $.getJSON( jsonPath+'tv.json' ),
            $.getJSON( jsonPath+'executive.json' ),
            $.getJSON( jsonPath+'weather.json' )
        ).done(function( config, tv, executive, weather ){

            window.__DATA = window.__DATA || {};
            window.__DATA.config = config[0];
            window.__DATA.tv = tv[0];
            window.__DATA.executive = executive[0];
            window.__DATA.weather = weather[0];

            _render( tv[0] );
            _render( executive[0] );
            _render( weather[0] );
        }));
    };

    dataBinding = function( templatePath, data, $target ){
        $target = $target || $('#l-wrap');

        $.ajax({
            url : 'partials/'+templatePath+'.html',
            async : false,
            dataType : 'text',
            success : function(template){
                var _template = _.template(template);
                $target.html( _template( {obj:data} ) );
            }
        });
    };

    _render = function( obj ){
        if( obj.module ){
            dataBinding( obj.module, obj, $('#'+obj.module) );
        }
    };


    reInit = function(){
        $.when(
            $.getJSON('data.json')
        ).then(function( data ){
            if( !_.isEqual( window.__DATA, data) ){
                console.log('데이터 바뀜');
            } else {
                console.log('데이터 같음');
            }
        });
    };


    return {

        init : function( callback ){
            $.when(
                _init()
            ).then(function(){
                callback && callback();
            });
        },

        reInit : reInit,

        dataBinding : dataBinding
    }
});
