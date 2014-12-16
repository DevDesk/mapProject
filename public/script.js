$(function () {

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

$(function () {
	$('#myTab a:first').tab('show')
})

$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})



})

