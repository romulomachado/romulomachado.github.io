$('.menu-opener, .menu-closer').click(function(){
  $('body').toggleClass('menu-open');
});

$('.menu').css('height', $('body').height());
