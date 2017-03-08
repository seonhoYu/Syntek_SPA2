importScripts('vendor/lodash.min.js');


onmessage = function(e){
    var result = {};
    var obj = JSON.parse( e.data),
        oldObj = obj.oldObj,
        newObj = obj.newObj;

    //TV and Executive Data
    /*if( obj.module == 'tv' || obj.module == 'executive' ){
        if( !_.isEqual(oldObj,newObj) ){
            if( _.size(oldObj.data) != _.size(newObj.data) ){
                //갯수 변화
                result = {
                    method : 'change',
                    module : obj.module,
                    newData : newObj
                }
            } else {
                //프로퍼티 변화
                result = {
                    method : 'update',
                    module : obj.module,
                    newData : newObj,
                    updateTarget : []
                };

                _.forEach( oldObj.data, function( n, key ){
                    if( !_.isEqual( n, newObj.data[key] ) ){
                        result.updateTarget.push( newObj.data[key] );
                    }
                });
            }

            postMessage( JSON.stringify(result) );
        }
    } */

    if( !_.isEqual(oldObj,newObj) ){
            if( _.size(oldObj.data) != _.size(newObj.data) ){
                //갯수 변화
                result = {
                    method : 'change',
                    module : obj.module,
                    newData : newObj
                }
            } else {
                //프로퍼티 변화
                result = {
                    method : 'update',
                    module : obj.module,
                    newData : newObj,
                    updateTarget : []
                };

                _.forEach( oldObj.data, function( n, key ){
                    if( !_.isEqual( n, newObj.data[key] ) ){
                        result.updateTarget.push( newObj.data[key] );
                    }
                });
            }

            postMessage( JSON.stringify(result) );
        }


    // Weather and Config
    /*if( obj.module == 'weather' ){
        if( !_.isEqual(oldObj,newObj) ){
            result = {
                method : 'change',
                module : obj.module,
                newData : newObj
            };
            postMessage( JSON.stringify(result) );
        }
    } */

};
