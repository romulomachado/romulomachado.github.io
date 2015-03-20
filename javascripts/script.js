function resetColors() {
  $('html').css('background-color', '#ecf0f1');
  $('html').css('background', 'none');
  $('html').css('color', '#000');
  $('.skill').css('color', '#000');
  $('footer a').css('color', '#000');
}

function removeCode() {
  $('.code').hide();
  $('h1').css('text-shadow', '2px 2px 3px black');
  $('h5').css('text-shadow', '2px 2px 3px white');
}

function hoverSkill(language, primaryColor) {
  $('html').css('background-color', primaryColor);
  $(".code." + language + "-code").css('display', 'block');
}

function changeColors() {
  $('h5').css('text-shadow', '2px 2px 3px black');
  $('html').css('color', '#fff');
  $('.skill').css('color', '#fff');
  $('footer a').css('color', '#fff');
}


$('.skill').on('mouseleave', function() {
  resetColors();
  removeCode();
});

$('#ruby').on('mouseover', function() {
  hoverSkill('ruby', '#e74c3c');
  changeColors();
});

$('#html').on('mouseover', function() {
  hoverSkill('html', '#f06529');
  changeColors();
});

$('#css').on('mouseover', function() {
  hoverSkill('css', '#33a9dc');
  changeColors();
});

$('#javascript').on('mouseover', function() {
  hoverSkill('js', '#f7df1e');
  $('h1').css('text-shadow', '2px 2px 3px white');
  $('h5').css('text-shadow', '2px 2px 3px white');
  $('footer a').css('color', '#000');
});
