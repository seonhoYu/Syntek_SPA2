var lifeTime = [],
    timer = null;


onmessage = function(e){

    var obj = JSON.parse( e.data);

    if(obj.module == 'config'){
        lifeTime[0] = obj.TvBoardPostTime * 1000;
        lifeTime[1] = obj.ExecutiveInformationPostTime * 1000;

        timerFunc( obj.startIdx-1 );
    }
};

function timerFunc( targetIdx ){
    clearTimeout( timer );

    if( lifeTime[targetIdx] != 0 ){
        timer = setTimeout(function(){
            if(targetIdx == 0){
                postMessage(2);
                timerFunc(1);
            } else if ( targetIdx == 1){
                postMessage(1);
                timerFunc(0);
            }
        }, lifeTime[targetIdx]);
    }
}
