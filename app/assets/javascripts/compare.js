$(function () {
  let target_field = $("#target-text")
  let fixed_field = $("#fixed-text")
  let recognized_field = $("#recognized-text")
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

  function showResult(operation) {
    let target = ""
    let recognized = ""
    let ss

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
