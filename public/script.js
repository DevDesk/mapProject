$(function () {

	$('.alert').on('click',function(){
		$(this).slideUp();
	});


  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

//$('.datepicker').datepicker();

	$('#myTab a:first').tab('show')


	$('#myTab a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	});


});

