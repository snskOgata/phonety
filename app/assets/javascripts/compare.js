$(function () {
  // 音声認識エンジンのセッティング
  SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.lang = 'en_US';
  recognition.interimResults = true;
  recognition.continuous = true;

  // 音声合成エンジンのセッティング
  var synthe = new SpeechSynthesisUtterance();
  synthe.lang = 'en-US';
  synthe.rate = 1.0;


  // テキストフィールド
  var target_field = $("#target-text");
  var fixed_field = $("#fixed-text");
  var recognized_field = $("#recognized-text");

  // ボタンの初期設定
  $("#compare-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#edit-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#stop-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#refresh-btn").prop("disabled", true).css('background-color', 'lightgrey');

  var target_sentence = fixed_field.text();

  // compareボタンを押すと非同期通信で比較
  $('#compare-btn').on('click', function () {
    $("#compare-btn").prop("disabled", true).css('background-color', 'lightgrey');

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
        alert("エラーが発生しました\nページを更新してください")
      })
  })

  $("#speed-selector").change(function () {
    synthe.rate = $(this).val();
  });

  // セットボタンを押すと、値を渡して固定フィールドに切り替える
  $('#set-btn').on('click', function () {
    $("#edit-btn").prop("disabled", false).css('background-color', 'white');
    $("#set-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#refresh-btn").prop("disabled", false).css('background-color', 'white');
    target_sentence = target_field.val();
    fixed_field.text(target_sentence);
    target_field.hide();
    fixed_field.show();
  })

  $('#edit-btn').on('click', function () {
    $("#edit-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#set-btn").prop("disabled", false).css('background-color', 'white');
    $("#refresh-btn").prop("disabled", true).css('background-color', 'lightgrey');
    target_field.show();
    fixed_field.hide();
  })

  $('#speech-btn').on('click', function () {
    speechSynthesis.cancel();
    synthe.text = target_sentence;
    speechSynthesis.speak(synthe);
  })

  $('#refresh-btn').on('click', function () {
    fixed_field.text(target_sentence);
  })

  $('#rec-btn').on('click', function () {
    $("#rec-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#stop-btn").prop("disabled", false).css('background-color', 'white');
    recognized_field.text("");
    finalTranscript = "";
    recognition.start();
  })

  $('#stop-btn').on('click', function () {
    $("#rec-btn").prop("disabled", false).css('background-color', 'white');
    $("#stop-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#compare-btn").prop("disabled", false).css('background-color', 'white');
    recognition.stop();
  })

  //　認識中の処理
  var finalText = "";

  recognition.onresult = function (e) {
    var interimText = ""
    for (var i = 0; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        finalText += e.results[i][0].transcript;
        interimText = "";
      } else {
        interimText += e.results[i][0].transcript;
      }
    }
    recognized_field.text(finalText + interimText)
  }

  // 比較結果の表示
  function showResult(operation) {
    var target = "";
    var recognized = "";
    var ss; // 操作と単語を分離 e.g.)"+:Hello" -> "+", "Hello"

    $.each(operation, function (i, value) {
      ss = value.split(":");

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
    $("#fixed-text").text("").append(target);
    $("#recognized-text").text("").append(recognized);
  }
});
