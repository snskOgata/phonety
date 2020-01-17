$(function () {

  var today = new Date();
  var startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 11);

  var cal = new CalHeatMap();
  cal.init({
    itemSelector: "#heatmap",
    data: {
      "1579186800": 25,
      "1579100400": 20,
      "1579014000": 15,
      "1578927600": 10,
      "1578841200": 5,
    },
    cellSize: 14,
    domain: "month",
    subDomain: "day",
    range: 12,
    tooltip: false,
    start: startDate,

    legend: [5, 10, 15, 20],
    domainLabelFormat: "%b",
    weekStartOnMonday: false,
    legendCellSize: 14,
    legendColors: {
      min: "#efefef",
      max: "green",
      empty: "white",

    },
    highlight: "now",
  });

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