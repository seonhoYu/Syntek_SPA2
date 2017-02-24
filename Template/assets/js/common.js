/**
* @file  common.js
* @brief Subpage motion
*/

define(['jquery'], function ($) {
    
    $("img.new").each(function() {
        var $ui = $(this);

        var new_in = function() {
            
            $ui.attr("src", $ui.data("in"));
            TweenMax.delayedCall(4.5, new_out);
            
        }
        
        var new_out = function() {
            
            $ui.attr("src", $ui.data("out"));
            TweenMax.delayedCall(3, new_in);
            
        }

        $ui.css({ visibility:"visible" });
        new_in();
    });

    // 보드 B - 콤보
    $(".combo").each(function() {
        
        var $ui = $(this);
        var $content = $ui.find("li");
        var $img = $content.find("figcaption > img");
        var total = $content.length;
        var index = 0;
        var delayTime = 10; // 10초
        
        if ($content.length == 1) return;
        //TweenMax.delayedCall(delayTime, img_change);
        balloon();
        
        function img_change() {
            
            var old = index;
            index = (index == total - 1) ? 0 : index + 1;
            TweenMax.to($content.eq(old), 0.3, { autoAlpha:0, ease:Cubic.easeOut });
            TweenMax.to($content.eq(index), 0.5, { autoAlpha:1, ease:Sine.easeOut });
            TweenMax.set($content.eq(index).find("figure > img"), { y:-50 });
            TweenMax.to($content.eq(index).find("figure > img"), 0.8, { y:0, ease:Bounce.easeOut });
            TweenMax.delayedCall(delayTime, img_change);
            
            $content.find(".balloon").attr("src", "Template/assets/source/empty.png");
            balloon();
            
        }
        
        function balloon() {
            
            if ($content.eq(index).find(".balloon")[0]) {
                var $balloon = $content.eq(index).find(".balloon");
                $balloon.attr("src", "Template/assets/source/combo_balloon1.gif");
                TweenMax.delayedCall(2.2, function() {
                    $balloon.attr("src", "Template/assets/source/combo_balloon2.gif");
                });
            }
            
        }
        
    });

    // 보드 C,D - 메뉴 텍스트 변경
    $(".comp_menu .inner").each(function() {
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
            TweenMax.to($content.eq(old), 0.5, { top:"100%", ease:Sine.easeInOut });
            TweenMax.set($content.eq(index), { top:"-100%" });
            TweenMax.to($content.eq(index), 0.5, { top:0, ease:Sine.easeInOut });
            TweenMax.delayedCall(delayTime, menu_change);
            
        }
        
    });

    // 보드 C - 음료이미지
    $(".drink").each(function() {
        
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
            TweenMax.to($content.eq(old), 0.3, { autoAlpha:0, ease:Cubic.easeOut });
            TweenMax.to($content.eq(index), 0.5, { autoAlpha:1, ease:Sine.easeOut });
            TweenMax.set($content.eq(index).find("figure > img"), { y:-50 });
            TweenMax.to($content.eq(index).find("figure > img"), 0.8, { y:0, ease:Bounce.easeOut });
            text_change();
            TweenMax.delayedCall(delayTime, img_change);
            
        }
        
        function text_change() {
            
            $img.each(function(_i) {
                
                var $this = $(this);
                if (_i == index) $this.attr("src", $this.data("gif"));
                else $this.attr("src", $this.data("empty"));
                
            });
            
        }
        
    });
})