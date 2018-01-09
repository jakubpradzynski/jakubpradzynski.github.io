$(document).ready(function () {
    $(".success").click(function() {
        $('html, body').animate({
            scrollTop: $("#start").offset().top
        }, 1000);
    });
    $(".info").click(function() {
        $('html, body').animate({
            scrollTop: $("#about-me").offset().top
        }, 1000);
    });
    $(".warning").click(function() {
        $('html, body').animate({
            scrollTop: $("#portfolio").offset().top
        }, 1000);
    });
    $(".danger").click(function() {
        $('html, body').animate({
            scrollTop: $("#contact").offset().top
        }, 1000);
    });
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('nav').css({
                'display': 'none'
            });
        }
    });
    $(function () {
       $(window).scroll(function () {
           var scroll = $(window).scrollTop();
           var done = false;
           if (scroll >= 200 && done === false) {
               $('nav').hide();
               $('.show-menu').show(500);
           } else {
               $('nav').show(500);
               $('.show-menu').hide(500);
           }
       })
    });
    $(".show-menu").click(function() {
        $('html, body').animate({
            scrollTop: $("#start").offset().top
        }, 500);
    });

    $('.project').click(function() {
        $(this).next().css({
            'display': 'block'
        });
    });

    $('.overlay').click(function () {
        $('.overlay').css({
            'display': 'none'
        });
    });
});