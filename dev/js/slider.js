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