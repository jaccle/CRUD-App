$(function() {

var grade = $('#gradeLevel').val();


    //can just use age/grade to determine student or parent, so if focusing on elem don't need to worry about if it is a parent or student

    //disable submit on modal on pageload
    $('#createParent').prop('disabled', true);
    //
    // $('input').on('focusout', function() {
    // 	if ($('#userKey').val() !== "" && $('#email').val() !== "" && $('#pwd').val() !== "" && $('#confirmpwd').val()) {
    // 		$('#createParent').prop('disabled', false);
    // 	}
    // }

    //fancy password matching
    $('#pwd').on('focusout', function() {
        if ($('#pwd').val().length >= 6) {
            $('#pwd').parent().addClass('has-success has-feedback');
            $('#pwd').parent().removeClass('has-warning');
        } else {
            $('#pwd').parent().removeClass('has-success has-feedback');
            $('#pwd').parent().addClass('has-warning');
        }
    });
    $('#confirmpwd').on('focusout', function() {
        if ($('#pwd').val() === $('#confirmpwd').val()) {
            $('#pwd').parent().removeClass('has-warning');
            $('#confirmpwd').parent().addClass('has-success has-feedback');
            $('#signup').disabled('fasle');
        } else {
            $('#pwd').parent().removeClass('has-success has-feedback');
            $('#confirmpwd').parent().addClass('has-warning');

        }
    });

    //set form action with _id with key modal
    $('#userKey').on('focusout', function() {
        $('#keyForm').attr('action', '/students/' + $('#userKey').val() + '?_method=put');
    });

    $('#keyForm').on('submit', function(e) {
        e.preventDefault();
    });

    // Add auto highlight to all input fields
    $("input").click(function() {
        $(this).select();
    });

    // $('#loginEmail').attr('name', 'student.parent1[email]' || 'teacher[email');


    //determine age
    var birthday = $('.birthdate').text();
    birthday = birthday.toString().split('-');
    var date = new Date();
    var year = date.getFullYear();
    var age = year - parseInt(birthday[0]);
    $('.age').html(age);
    $('#age').val(age);


    // // //preselect title from dropdown
    // 	$('option').text($('#title').val()).prop('checked', true).select();
    //     $('option').text($('#title').val()).prop('checked', true).select();











});
