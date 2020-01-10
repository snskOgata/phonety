$(function () {
  var target_field = $("#target-text")
  var fixed_field = $("#fixed-text")
  var recognized_field = $("#recognized-text")

  var target_sentence = fixed_field.text()

  $('#compare-btn').on('click', function () {

    $.ajax({
      url: "/api/compares",
      type: "POST",
      data: {
        target: fixed_field.text(),
        recognized: recognized_field.text()
      },
      dataType: 'json'
    })
      .done(function (data) {
        showResult(data.operation)
      })
      .fail(function (e) {
        alert("エラーが発生しました\mページを更新してください")
      })
  })

  // セットボタンを押すと、値を渡して固定フィールドに切り替える
  $('#set-btn').on('click', function () {
    target_sentence = target_field.val()
    fixed_field.text(target_sentence)
    target_field.hide();
    fixed_field.show();
  })

  $('#edit-btn').on('click', function () {
    target_field.show();
    fixed_field.hide();
  })

  $('#refresh-btn').on('click', function () {
    fixed_field.text(target_sentence)
  })


  function showResult(operation) {
    var target = ""
    var recognized = ""
    var ss

    $.each(operation, function (i, value) {
      ss = value.split(":")

      if (ss[0] === "|") {
        target += "<span style=\"color:black\">" + ss[1] + " </span>";
        recognized += "<span style=\"color:black\">" + ss[1] + " </span>";
      }
      else if (ss[0] === "-") {
        target += "<span style=\"color:red\">" + ss[1] + " </span>";
      }
      else if (ss[0] === "+") {
        recognized += "<span style=\"color:red\">" + ss[1] + " </span>";
      }
    })
    $("#fixed-text").text("").append(target)
    $("#recognized-text").text("").append(recognized)
  }
});
