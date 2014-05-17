$('.mobile-nav-toggler, .mobile-nav-close').click(function(){
  $('body').toggleClass('mobile-nav-open')
});

$('.mobile-nav-holder').css('height', $('body').height());
