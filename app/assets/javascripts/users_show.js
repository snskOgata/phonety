$(function () {

  $('#goal-update-btn').hide();

  $('#goal-edit-btn').on('click', function () {
    $('#goal-update-btn').show();
    $('#goal-edit-btn').hide();
    $('#goal-text').prop("disabled", false).css('background-color', 'white').focus();
  });

  $('#goal-update-btn').on('click', function () {
    $('#goal-edit-btn').show();
    $('#goal-update-btn').hide();
    $('#goal-text').prop("disabled", true).css('background-color', '#f5f5f5');
  });
})