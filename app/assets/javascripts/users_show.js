$(function () {

  $('#goal-update-btn').hide();

  // 編集ボタンが押された場合
  $('#goal-edit-btn').on('click', function () {
    $('#goal-update-btn').show();
    $('#goal-edit-btn').hide();
    $('#goal-text').prop("disabled", false).css('background-color', 'white').focus();
  });

  // 更新ボタンが押された場合
  $('#goal-update-btn').on('click', function () {
    $.ajax({
      url: location.pathname + '/update_goal',
      type: 'PATCH',
      data: { goal: $('#goal-text').val() },
    }).done(function () {
      $('#goal-edit-btn').show();
      $('#goal-update-btn').hide();
      $('#goal-text').prop("disabled", true).css('background-color', '#f5f5f5');
    })
      .fail(function () {
        alert('更新に失敗しました。')
      })
  });
})