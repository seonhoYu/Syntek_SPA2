var dayObj = {
    '1' : '월',
    '2' : '화',
    '3' : '수',
    '4' : '목',
    '5' : '금',
    '6' : '토',
    '7' : '일'
};

function addZero( digit ){
    digit = parseInt(digit, 10);
    if( digit < 10){
        digit = '0'+digit;
    }

    return digit
}


function time(){
    var _now = new Date();
    var YYYY = _now.getFullYear(),
        MM = _now.getMonth()+ 1,
        DD = _now.getDate(),
        DAY = _now.getDay(),
        hh = _now.getHours(),
        mm  = _now.getMinutes(),
        isAMorPM = '오전';

    if( hh > 12 ){
        hh = hh % 12;
        isAMorPM = '오후';
    }

    hh = addZero(hh);
    mm = addZero(mm);
    MM = addZero(MM);
    DD = addZero(DD);

    postMessage( {
        time : hh+':'+mm+' '+isAMorPM,
        days : YYYY+'.'+MM+'.'+DD+' ('+dayObj[DAY]+')'
    } );
}

time();

setInterval(function(){
    time();
},60000);
