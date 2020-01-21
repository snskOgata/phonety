$(function () {
  // 音声認識エンジンのセッティング
  SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.lang = 'en_US';
  recognition.interimResults = true;
  recognition.continuous = true;

  // 単語用の音声認識エンジン
  var wordRecognition = new SpeechRecognition();
  wordRecognition.lang = 'en_US';
  wordRecognition.interimResults = true;
  wordRecognition.continuous = true;

  // 音声合成エンジンのセッティング
  var synthe = new SpeechSynthesisUtterance();
  synthe.lang = 'en-US';
  synthe.rate = 1.0;

  // 各種初期値
  var target_list = [];
  var current_num = 0;
  var words_list = [];
  var correctness = 0;
  var correctness_list = []
  var note_list = [];

  // テキストフィールド
  var target_field = $("#target-text");
  var fixed_field = $("#fixed-text");
  var recognized_field = $("#recognized-text");

  // ボタンの初期設定
  // $("#compare-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#edit-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#refresh-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#speech-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#compare-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#next-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#back-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#save-btn").prop("disabled", true).css('background-color', 'lightgrey');

  // 初期値設定
  correctness = $('#correctness').text().replace(/[^0-9]/g, '');
  var target_sentence = target_field.val();
  target_field.focus();


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
        showResult(data.operation);
        showWords();
        $("#save-btn").prop("disabled", false).css('background-color', 'white');
      })
      .fail(function (e) {
        alert("エラーが発生しました\nページを更新してください")
      })
  })

  // saveボタンを押すと、学習データを保存
  $('#save-btn').on('click', function () {
    $.ajax({
      url: "/api/lessons",
      type: "POST",
      data: {
        content: $("#target-text").text(),
        correctness: correctness,
        note: $("#note-field").val()
      },
      dataType: 'json'
    })
      .done(function () {
        var index = target_list.indexOf(target_sentence)
        // リストに含まれなければ追加
        if (index < 0) {
          target_list.push(target_sentence);
          correctness_list.push(correctness);
          note_list.push($("#note-field".val()));
          current_num = target_list.length - 1;
        }
        // リストに含まれる場合は精度・ノートを修正
        else {
          correctness_list[index] = correctness;
          note_list[index] = $("#note-field").val();
          // 該当のセンテンスの場所に移動
          current_num = index;
        }
        $("#save-btn").prop("disabled", true).css('background-color', 'lightgrey');
      })
      .fail(function (e) {
        alert("エラーが発生しました\nページを更新してください");
      })
  })

  // 更新ボタンが押された場合
  $('#update-btn').on('click', function () {
    $.ajax({
      url: location.pathname,
      type: 'PATCH',
      data: {
        content: target_field.val(),
        correctness: correctness,
        note: $('#note-field').val()
      }
    }).done(function () {
      $('#goal-edit-btn').show();
      $('#goal-update-btn').hide();
      $('#goal-text').prop("disabled", true).css('background-color', '#f5f5f5');
    })
      .fail(function () {
        alert('更新に失敗しました。')
      })
  });

  $('#new-btn').on('click', function () {
    // 最新の番号を取得
    current_num = target_list.length
    // 各種状態をリセット
    $("#edit-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#set-btn").prop("disabled", false).css('background-color', 'white');
    $("#refresh-btn").prop("disabled", true).css('background-color', 'lightgrey');
    target_field.val("").show().focus();
    fixed_field.val("").hide();
    recognized_field.text("");

    // next/backボタンの更新
    $("#correctness").text("0%")
    if (current_num > 0) {
      $("#back-btn").prop("disabled", false).css('background-color', 'white');
    }
    $("#next-btn").prop("disabled", true).css('background-color', 'lightgrey');
  });

  $('#back-btn').on('click', function () {
    current_num--;
    redisplay_sentence();
    redisplay_nextback();
    recognized_field.text("");
    $("#save-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#compare-btn").prop("disabled", false).css('background-color', 'lightgrey');
  })

  $('#next-btn').on('click', function () {
    current_num++;
    redisplay_sentence();
    redisplay_nextback();
    recognized_field.text("");
    $("#save-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#compare-btn").prop("disabled", false).css('background-color', 'lightgrey');
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
    recognized_field.val("");
    finalTranscript = "";
    recognition.start();
  })

  $('#stop-btn').on('click', function () {
    $("#rec-btn").prop("disabled", false).css('background-color', 'white');
    $("#stop-btn").prop("disabled", true).css('background-color', 'lightgrey');
    $("#compare-btn").prop("disabled", false).css('background-color', 'white');
    recognition.stop();
  })

  // 認識中の処理
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
    var target = "";
    var recognized = "";
    var correct_num = 0
    var wrong_num = 0
    var ss; // 操作と単語を分離 e.g.)"+:Hello" -> "+", "Hello"

    $.each(operation, function (i, value) {
      ss = value.split(":");

      if (ss[0] === "|") {
        target += "<span style=\"color:black\">" + ss[1] + " </span>";
        recognized += "<span style=\"color:black\">" + ss[1] + " </span>";
        correct_num++;
      }
      else if (ss[0] === "-") {
        target += "<span style=\"color:red\">" + ss[1] + " </span>";
        wrong_num++;
        // ワードリストに入っていなければ追加
        if (words_list.indexOf(ss[1]) < 0) {
          words_list.push(ss[1])
        }
      }
      else if (ss[0] === "+") {
        recognized += "<span style=\"color:red\">" + ss[1] + " </span>";
        // ワードリストに入っていなければ追加
        if (words_list.indexOf(ss[1]) < 0) {
          words_list.push(ss[1])
        }
      }
    })
    $("#fixed-text").text("").append(target);
    $("#recognized-text").text("").append(recognized);
    correctness = Math.round(correct_num / (correct_num + wrong_num) * 100)
    $('#correctness').text(correctness + "%");
  }

  // ワードリストに入った単語郡をテーブルに表示する
  function showWords() {
    var tableHTML = ""
    $.each(words_list,
      function (index, word) {
        tableHTML += "<tr><td class=\"missed-word\">" + word + "</td>";
        tableHTML += "<td><i id=\"play-word-btn\" class=\"fa fa-play icon word-icon\" data-num=\"" + index + "\"></td>";
        tableHTML += "<td><i id=\"delete-word-btn\" class=\"fa fa-trash-alt icon word-icon\" data-num=\"" + index + "\"></td></tr>";
      })
    $("#missed-words").html(tableHTML);
  }

  // 後から追加された要素は$("btn").onでは反応しないためこのような記述になる
  $(document).on("click", "#delete-word-btn", function () {
    index = $(this).data('num');
    words_list.splice(index, 1);
    showWords();
  })

  $(document).on("click", "#play-word-btn", function () {
    var index = $(this).data('num');
    speechSynthesis.cancel();
    synthe.text = words_list[index];
    speechSynthesis.speak(synthe);
  })

  $('#add-word-btn').on('click', function () {
    var input = $('#word-input');
    if (words_list.indexOf(input.val()) < 0) {
      if (input.val() !== "") {
        words_list.push(input.val());
        input.val("").focus();
        showWords();
      }
      else {
        alert("文字を入力してください")
      }
    }
    else {
      alert("既にリストに入っています")
    }
  })

  $('#remove-all-btn').on('click', function () {
    if (confirm("単語練習をクリアします")) {
      words_list = [];
      showWords();
    } else {
      return false;
    }
  })

  // 単語追加フィールドでエンターを押すと追加
  $("#word-input").keyup(function (event) {
    if (event.keyCode === 13) {
      $("#add-word-btn").click();
    }
  });

  $('#rec-word-btn').on('click', function () {
    $('#word-input').val("")
    wordRecognition.stop()
    wordRecognition.onresult = function (e) {
      var finalText = "";
      var interimText = ""
      for (var i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript.toLowerCase();
          interimText = "";
        } else {
          interimText += e.results[i][0].transcript.toLowerCase();
        }
      }
      $('#word-input').val(finalText + interimText)
    }
    wordRecognition.start();
    $(this).prop("disabled", true).css('background-color', 'lightgrey');
  });
  $('#stop-word-btn').on('click', function () {
    wordRecognition.stop();
    $("#rec-word-btn").prop("disabled", false).css('background-color', 'white');
  });

  function redisplay_sentence() {
    target_field.val(target_list[current_num]);
    fixed_field.val(target_list[current_num]);
    $('#correctness').text(correctness_list[current_num] + "%");
    $("#note-field").val(note_list[current_num]);
  }
  function redisplay_nextback() {
    // backボタンのオンオフ
    if (current_num > 0) {
      $("#back-btn").prop("disabled", false).css('background-color', 'white');
    } else {
      $("#back-btn").prop("disabled", true).css('background-color', 'lightgrey');
    }

    // nextボタンのオンオフ
    if (current_num > -1) {
      if (current_num < (target_list.length - 1)) {
        $("#next-btn").prop("disabled", false).css('background-color', 'white');
      } else {
        $("#next-btn").prop("disabled", true).css('background-color', 'lightgrey');
      }
    }
  }
});
