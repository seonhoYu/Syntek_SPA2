/**
* @file  common.js
* @brief Subpage motion
*/

var animationList = [];
var tweenMaxList = [];


function activeAnimation(page) {
    TweenMax.killAll();
    
    $.each(animationList, function (idx, obj) {
        if (obj.id == page) {
            obj.fn();
        }
    });
}

define(['jquery', 'handlebars', '../../assets/js/uiVideoPlayer', '../../assets/js/uiMenuGalleryRolling', '../../assets/js/uiNormalGalleryRolling'], function ($, Handlebars, VideoPlayer, GalleryRolling, NormalRolling) {
    
    var GalleryRoll = new GalleryRolling($(".page-current .roll"));
    var NormalRoll = new NormalRolling($(".page-current .gallery"));
    var VideoRoll = new VideoPlayer($(".page-current .video-frame"));

    function setAnimation(id, fn) {
        animationList.push({ id: id, fn: fn });
        if (environment.screenId == id) {
            fn(id);
        }
    };

    setAnimation(2, function () {
        $("img.new").each(function () {
            var $ui = $(this);

            var new_in = function () {

                $ui.attr("src", $ui.data("in"));
                TweenMax.delayedCall(4.5, new_out);
            }

            var new_out = function () {

                $ui.attr("src", $ui.data("out"));
                TweenMax.delayedCall(3, new_in);
            }
            $ui.css({ visibility: "visible" });
            new_in();
        });

        // 보드 B - 콤보
        $(".aside .combo").each(function () {

            var $ui = $(this);
            var $content = $ui.find("li");
            var $img = $content.find("figcaption > img");
            var total = $content.length;
            var index = 0;
            var delayTime = 10; // 10초

            if ($content.length == 1) return;

            TweenMax.delayedCall(delayTime, img_change);
            balloon();

            function img_change() {

                var old = index;
                index = (index == total - 1) ? 0 : index + 1;
                TweenMax.to($content.eq(old), 0.3, { autoAlpha: 0, ease: Cubic.easeOut });
                TweenMax.to($content.eq(index), 0.5, { autoAlpha: 1, ease: Sine.easeOut });  
                TweenMax.set($content.eq(index).find("figure > img"), { y: -50 });
                TweenMax.to($content.eq(index).find("figure > img"), 0.8, { y: 0, ease: Bounce.easeOut });
                TweenMax.delayedCall(delayTime, img_change);

                $content.find(".balloon").attr("src", "../../Pages/assets/source/empty.png");
                balloon();
            }

            function balloon() {

                if ($content.eq(index).find(".balloon")[0]) {
                    var $balloon = $content.eq(index).find(".balloon");
                    $balloon.attr("src", "../../Pages/assets/source/combo_balloon2.png");

                    TweenMax.delayedCall(2.2, function () {
                        $balloon.attr("src", "../../Pages/assets/source/combo_balloon2.png");
                    });
                }
            }
        });
    })

    setAnimation(3, function () {
        $(".boardc .comp_menu .inner").each(function () {
            var $ui = $(this);
            var $content = $ui.children("dl");
            var total = $content.length;
            var index = 0;
            var delayTime = 5; // 5초

            if ($content.length == 1) return;

            TweenMax.delayedCall(delayTime, menu_change);
            
            function menu_change() {

                var old = index;
                index = (index == total - 1) ? 0 : index + 1;
                TweenMax.to($content.eq(old), 0.5, { top: "100%", ease: Sine.easeInOut });
                TweenMax.set($content.eq(index), { top: "-100%" });
                TweenMax.to($content.eq(index), 0.5, { top: 0, ease: Sine.easeInOut });
                TweenMax.delayedCall(delayTime, menu_change);
            }
        });

        // 보드 C - 음료이미지
        $(".drink").each(function () {

            var $ui = $(this);
            var $content = $ui.find("li");
            var $img = $content.find("figcaption > img");
            var total = $content.length;
            var index = 0;
            var delayTime = 5; // 15초

            if ($content.length == 1) return;

            TweenMax.delayedCall(delayTime, img_change);
            
            text_change();

            function img_change() {

                var old = index;
                index = (index == total - 1) ? 0 : index + 1;
                TweenMax.to($content.eq(old), 0.3, { autoAlpha: 0, ease: Cubic.easeOut });
                TweenMax.to($content.eq(index), 0.5, { autoAlpha: 1, ease: Sine.easeOut });
                TweenMax.set($content.eq(index).find("figure > img"), { y: -50 });
                TweenMax.to($content.eq(index).find("figure > img"), 0.8, { y: 0, ease: Bounce.easeOut });
                text_change();
                TweenMax.delayedCall(delayTime, img_change);
            }

            function text_change() {

                $img.each(function (_i) {

                    var $this = $(this);
                    if (_i == index) $this.attr("src", $this.data("gif"));
                    else $this.attr("src", $this.data("empty"));

                });
            }
        });
    });

    setAnimation(4, function () {
        $(".boardd .comp_menu .inner").each(function () {
            var $ui = $(this);
            var $content = $ui.children("dl");
            var total = $content.length;
            var index = 0;
            var delayTime = 5; // 5초

            if ($content.length == 1) return;

            TweenMax.delayedCall(delayTime, menu_change);
            
            function menu_change() {

                var old = index;
                index = (index == total - 1) ? 0 : index + 1;
                TweenMax.to($content.eq(old), 0.5, { top: "100%", ease: Sine.easeInOut });
                TweenMax.set($content.eq(index), { top: "-100%" });
                TweenMax.to($content.eq(index), 0.5, { top: 0, ease: Sine.easeInOut });
                TweenMax.delayedCall(delayTime, menu_change);
            }
        });
    });

    setAnimation(7, function () {
        GalleryRoll.on();
    });

    setAnimation(8, function () {
        NormalRoll.on();
    });

    setAnimation(10, function () {
        NormalRoll.on();
        VideoRoll.on();
    });

    setTimeout(function () {
        PageWeather.setWeather(function (data) {
            $.get('../../Pages/PT005/index.html', function (html) {
                var theTemplate = Handlebars.compile(html);
                var compiledHtml = theTemplate(data);
                $('#sectionPT005').html(compiledHtml);
                weatherAnimation();
            });
        });

        function weatherAnimation() {
            var forecast = $('#week-forecast');
            var params = $('#weather-params');
            var temp = $('#temperature');
            $(document).ready(function () {
                var i = 1000;
                forecast.children('li').each(function () {
                    $(this).delay(i).queue(function () {
                        $(this).addClass('active');
                        $(this).dequeue();
                    });
                    i += 250;
                });

                var ii = 600;
                params.children('li').each(function () {
                    $(this).delay(ii).queue(function () {
                        $(this).addClass('active');
                        $(this).dequeue();
                    });
                    ii += 200;
                });

                $(temp).delay(400).queue(function () {
                    $(this).addClass('active');
                    $(this).dequeue();
                });
            });
        }

        
    }, 2000);
    

})