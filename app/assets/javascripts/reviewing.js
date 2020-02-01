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
  var note_list = []

  var review_ids = []
  var lesson_ids = []

  // テキストフィールド
  var target_field = $("#target-text");
  var fixed_field = $("#fixed-text");
  target_field.hide();
  fixed_field.show();
  fixed_field.css('background-color', 'white');
  var recognized_field = $("#recognized-text");

  // ボタンの初期設定
  $("#compare-btn").prop("disabled", true).css('background-color', 'lightgrey');
  $("#back-btn").prop("disabled", true).css('background-color', 'lightgrey');

  var target_sentence = ""

  // ページ読み込み後に復習リストを取得
  $.get("/api/reviews/get_list_today",
    function (reviews) {
      $.each(reviews, function (i, review) {
        target_list.push(review.content);
        correctness_list.push(review.correctness);
        note_list.push(review.note);
        review_ids.push(review.review_id);
        lesson_ids.push(review.lesson_id);
      });

      // 一つ目のreview要素の表示
      target_sentence = target_list[0];
      target_field.val(target_sentence);
      fixed_field.text(target_sentence);
      $("#note-text").html(note_list[0]);
    });


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
        content: target_sentence,
        correctness: correctness
      },
      dataType: 'json'
    })
      .done(function () {
        var index = target_list.indexOf(target_sentence)
        // リストに含まれなければ追加
        if (index < 0) {
          target_list.push(target_sentence);
          correctness_list.push(correctness);
          current_num = target_list.length - 1
        }
        // リストに含まれる場合は精度を修正
        else {
          correctness_list[index] = correctness
          // 該当のセンテンスの場所に移動
          current_num = index
        }
        $("#save-btn").prop("disabled", true).css('background-color', 'lightgrey');
      })
      .fail(function (e) {
        alert("エラーが発生しました\nページを更新してください")
      })
  })

  $('#done-btn').on('click', function () {
    $("#done-btn").prop("disabled", true).css('background-color', 'lightgrey');

    $.ajax({
      url: "/api/reviews/done",
      type: "PATCH",
      data: {
        review_id: review_ids[current_num],
        lesson_id: lesson_ids[current_num],
        correctness: correctness_list[current_num]
      },
      dataType: 'json'
    })
      .done(function (data) {
      })
      .fail(function (e) {
        alert("エラーが発生しました\nページを更新してください")
      })
  })

  $('#back-btn').on('click', function () {
    current_num--;
    redisplay_sentence();
    redisplay_nextback();
    recognized_field.text("");
    $("#done-btn").prop("disabled", false).css('background-color', 'white');
    $("#compare-btn").prop("disabled", true).css('background-color', 'lightgrey');
  })

  $('#next-btn').on('click', function () {
    current_num++;
    redisplay_sentence();
    redisplay_nextback();
    recognized_field.text("");
    $("#done-btn").prop("disabled", false).css('background-color', 'white');
    $("#compare-btn").prop("disabled", true).css('background-color', 'lightgrey');
  })

  $("#speed-selector").change(function () {
    synthe.rate = $(this).val();
  });

  $('#speech-btn').on('click', function () {
    speechSynthesis.cancel();
    synthe.text = target_list[current_num];
    speechSynthesis.speak(synthe);
  })

  $('#cancel-btn').on('click', function () {
    speechSynthesis.cancel();
  })

  $('#refresh-btn').on('click', function () {
    fixed_field.text(target_list[current_num]);
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
    var recognized = "";
    var correct_num = 0
    var wrong_num = 0
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
        var elem1 = document.createElement("span");
        elem1.textContent = ss[1] + " ";
        $("#recognized-text").append(elem1)
        correct_num++;
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
        wrong_num++;
        // ワードリストに入っていなければ追加
        if (words_list.indexOf(ss[1]) < 0) {
          words_list.push(ss[1])
        }
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
        // ワードリストに入っていなければ追加
        if (words_list.indexOf(ss[1]) < 0) {
          words_list.push(ss[1])
        }
      }
    })

    //精度の計算と表示
    correctness = Math.round(correct_num / (correct_num + wrong_num) * 100)
    correctness_list[current_num] = correctness
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

  // ターゲット文の再描画
  function redisplay_sentence() {
    target_field.val(target_list[current_num]);
    fixed_field.text(target_list[current_num]);
    $('#correctness').text(correctness_list[current_num] + "%")
    $("#note-text").html(note_list[current_num]);
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
