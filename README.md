# README

Heroku:
https://arcane-waters-08193.herokuapp.com/

### サービス内容
英語学習支援アプリケーション
作者自身がTOEIC900を取った際に用いた学習・復習アプローチを詰め込んだ。
具体的には、リスニングとスピーキングを用いた総合学習、それを復習のサイクルに組み込むということをやっていた。
このアプリでは、前者に関しては、GoogleのWebSpeechAPIの音声合成・音声認識を用いて、より効果的な学習をどのような文章に対しても行えるようにした。
後者に関しては、学習内容保存時に復習のサイクルもDBに保存し、当日になると復習を通知、該当の内容を繰り返し学習できるようにしている。
[![Image from Gyazo](https://i.gyazo.com/cb375f409ec9fa07ab6d7857cf83ad1a.png)](https://gyazo.com/cb375f409ec9fa07ab6d7857cf83ad1a)

### 実装した機能
上記機能が主な内容だが、他にも
・Deviseを用いたユーザ機能
・LevenShtein距離を用いた文章比較で発音の正誤を提示
・Cal-heatmapを用いた学習履歴の視覚化
・Trixを用いたノート機能
・UIKitを用いたビュー内アクション
なども組み込んだ


### 使用技術
Ruby/Ruby on Rails/HTML/CSS/Javasript/
SQLite/Postgresql/Git/GitHub/Heroku/
Haml/Sass/jQuery/
Cal-heatmap/GoogleWebSpeechAPI/UIKit/
Devise/Trix/kaminari/

### 言語やフレームワークのバージョン
Ruby 2.5.1
Rails 5.2.4.1
Bundler version 2.1.2
sqlite3 3.28.0