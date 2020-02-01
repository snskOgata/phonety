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
  $("#set-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#stop-btn").prop("disabled", true).css('background-color', 'lightgrey');

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
    $("#speech-btn").prop("disabled", false).css('background-color', 'white');
    target_sentence = target_field.val();
    fixed_field.text(target_sentence);
    target_field.hide();
    fixed_field.show();
  })

  $('#edit-btn').on('click', function () {
    $("#edit-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#set-btn").prop("disabled", false).css('background-color', 'white');
    $("#refresh-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#speech-btn").prop("disabled", true).css('background-color', 'lightgrey');
    target_field.show().focus();
    fixed_field.hide();
  })

  $('#speech-btn').on('click', function () {
    speechSynthesis.cancel();
    synthe.text = target_sentence;
    speechSynthesis.speak(synthe);
  })

  $('#cancel-btn').on('click', function () {
    speechSynthesis.cancel();
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
  recognition.onresult = function (e) {
    var finalText = "";
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
    var ss; // 操作と単語を分離 e.g.)"+:Hello" -> "+", "Hello"

    //比較前にテキストを空に
    $("#fixed-text").text("")
    $("#recognized-text").text("")

    $.each(operation, function (i, value) {
      ss = value.split(":");

      //正しく発音できたもの
      if (ss[0] === "|") {
        var elem1 = document.createElement("span");
        elem1.textContent = ss[1] + " ";
        $("#fixed-text").append(elem1)
        var elem2 = document.createElement("span");
        elem2.textContent = ss[1] + " ";
        $("#recognized-text").append(elem2)
      }
      //ターゲット文で一致がなかったもの
      else if (ss[0] === "-") {
        var elem = document.createElement("span");
        elem.textContent = ss[1] + " ";

        elem.style.color = 'red'
        elem.style.cursor = "pointer"
        elem.onclick = function () {
          speechSynthesis.cancel();
          synthe.text = this.textContent;
          speechSynthesis.speak(synthe);
        };
        $("#fixed-text").append(elem);
      }
      //認識文で一致がなかったもの
      else if (ss[0] === "+") {
        var elem = document.createElement("span");
        elem.textContent = ss[1] + " ";
        elem.style.color = 'red'
        elem.style.cursor = "pointer"
        elem.onclick = function () {
          speechSynthesis.cancel();
          synthe.text = this.textContent;
          speechSynthesis.speak(synthe);
        };
        $("#recognized-text").append(elem)
      }
    })
  }
});
