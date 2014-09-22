/** 
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.0
 *
 */
 // Damn it! tis part isn't "linted"
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "src",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;
      
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                $self.attr("src", settings.placeholder);
            }
            
            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {
                            var original = $self.data(settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);
                            
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.data(settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });
              
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);

$(".js-lazy").lazyload({ effect : "fadeIn", threshold : 300 });
/* 
 * navigation script: sticky nav, anchor smooth scrolling, selecting current nav item 
*/
/* 
 * navigation script: sticky nav, anchor smooth scrolling, selecting current nav item 
*/

;(function ( $, window, document, undefined ) {
    var defaults = {
        header: "js-header",
        jumbo: "js-jumbo",
        navAnchor: "js-anchor",
        navLink: "js-link",
        navIcon: "js-icon",
        fixedHeader: "is-fixed",
        jumboScroll: "is-scroll",
        navToggle: "is-toggle",
        activeLink: "is-active"
    };

    function NavKit( element, options ) {
        this.options = $.extend( {}, defaults, options) ;
        this.element = element;     
        this.init();
    }

    NavKit.prototype.init = function () {
        var $this = $(this.element),
            $navAnchor = $("." + this.options.navAnchor),
            $navLink = $("." + this.options.navLink),
            $navIcon = $("." + this.options.navIcon),
            $header = $("." + this.options.header),
            $jumbo = $("." + this.options.jumbo),
            navHeight = $this.height(),
            navTopOffset = $header.offset().top,
            aArray = [],
            i;

        $(window).scroll($.proxy(function () {
            var topScroll = $(window).scrollTop();
    
            if (topScroll > navTopOffset) {
                $header.addClass(this.options.fixedHeader);
                $jumbo.addClass(this.options.jumboScroll);
    
            } else {
                $header.removeClass(this.options.fixedHeader);
                $jumbo.removeClass(this.options.jumboScroll);
            }
        }, this)); 

        $navIcon.on('click', $.proxy(function(e){
           e.preventDefault();
           $this.toggleClass(this.options.navToggle);
        }, this));

        // Smooth anchor scroll, targeted to our nav anchors 
        // Actually this thing was modified on csstricks
        $navAnchor.click(function () {
            if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") && 
                location.hostname === this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
                if (target.length) {
                $("html,body").animate({
                  scrollTop: target.offset().top
                }, 1000);
                return false;
              }
            }
        });
        //Highlight nav list item when current section visible
        //Originally this way is belong to http://www.callmenick.com
        for(i = 0; i < $navLink.length; i += 1) {
            var link = $navLink[i],
                ahref = $(link).attr('href');
                aArray.push(ahref);
        } // this for loop fills the aArray with attribute href values

        $(window).scroll($.proxy(function () {
            var windowPos = $(window).scrollTop(), // get the offset of the window from the top of page
                windowHeight = $(window).height(), // get the height of the window
                docHeight = $(document).height(),
                navHeight = $this.height(),
                $firstSection = $("section").eq(0);

            for (i = 0; i < aArray.length; i += 1) {
                var theID = aArray[i],
                sectPos = $(theID).offset().top - navHeight, // get the offset of the div from the top of page + except nav height
                sectHeight = $(theID).height(); // get the height of the div in question

                if (windowPos >= sectPos && windowPos < (sectPos + sectHeight)) {
                    $navLink.filter("[href='" + theID + "']").addClass(this.options.activeLink);
                } else {
                    $navLink.filter("[href='" + theID + "']").removeClass(this.options.activeLink);
                }
            }
        //highlight last nav list item on last section
            if (windowPos + windowHeight === docHeight) {
                if (!$this.find("li").filter(":last-child").find($navLink).hasClass(this.options.activeLink)) {
                    $navLink.filter("." + this.options.activeLink).removeClass(this.options.activeLink);
                    $this.find("li").filter(":last-child").find($navLink).addClass(this.options.activeLink);
                }
            }

        //highlight first nav item when first section has some top offset
        if (windowPos < $firstSection.offset().top) {
                if (!$this.find("li").filter(":first-child").find($navLink).hasClass(this.options.activeLink)) {
                    $navLink.filter("." + this.options.activeLink).removeClass(this.options.activeLink);
                    $this.find("li").filter(":first-child").find($navLink).addClass(this.options.activeLink);
                }
            }
        }, this));
    };

    $.fn.navKit = function ( options ) {
        return this.each(function () {          
            new NavKit( this, options );
        });
    };

})( jQuery, window, document );

$(".js-nav").navKit();
//Slide all this stuff
;(function ( $, window, document, undefined ) {
    var defaults = {
        slide: "js-slide",
        control: "js-control",
        active: "is-active",
        current: 0
    };    

    function SlideIt ( element, options ){
        this.options = $.extend( {}, defaults, options ) ;
        this.element = element;     
        this.init();
    };

    SlideIt.prototype.init = function(){
        var $this = $(this.element),
            $slide = $this.find("." + this.options.slide),
            $control = $this.find("." + this.options.control),
            currentNum = this.options.current,
            activeClass = this.options.active;

        $control.eq(currentNum).addClass(this.options.active);
        $slide.hide().eq(currentNum).show();

        $control.on('click', function (e){
            var currentSlide = $(this).index();
    
            $control.removeClass(activeClass);
            $(this).addClass(activeClass);
    
            $slide.slideUp().eq(currentSlide).slideDown();
    
            e.preventDefault();
        });    
    };

    $.fn.slideIt = function ( options ) {
        return this.each(function () {          
            new SlideIt( this, options );
        });
    };

})( jQuery, window, document );

$(".js-jumbo").slideIt();