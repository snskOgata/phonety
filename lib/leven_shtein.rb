module LevenShtein
  def getOperation(a_list, b_list)

    # 最短経路を求めるための行列グリッドの作成(初期値は0)
    a_len = a_list.length
    b_len = b_list.length
    grid = Array.new(a_len + 1).map{Array.new(b_len + 1, 0)}

    # グリッドの先頭部分の数値をセット
    (0..a_len).each do |i|
      grid[i][0] = i
    end
    (0..a_len).each do |j|
      grid[0][j] = j
    end

    # 最短経路の計算
    cost_a, cost_b, min = 0, 0, 0
    (1..a_len).each do |row|
      (1..b_len).each do |col|
        cost_a = grid[row-1][col] + 1
        cost_b = grid[row][col-1] + 1
        min = [cost_a, cost_b].min

        if a_list[row-1] == b_list[col-1]
          min = [min, grid[row-1][col-1]].min
        end
        grid[row][col] = min
      end
    end

    # 最短経路から追加(+:)、削除(-:)、共通("|:")を含めた配列を作成
    result = []
    row = a_len
    col = b_len

    a, d, c = 0

    while((row > 0) && (col > 0)) do
      a = grid[row][col-1]
      d = grid[row-1][col]
      c = grid[row-1][col-1]

      if d < a
        if a_list[row-1] == b_list[col-1] && c < d
          result << "|:" + alist[row-1]
          row -= 1
          col -= 1
        else
          result << "-:" + a_list[row-1]
          row -= 1
        end

      else
        if a_list[row-1] == b_list[col-1] && c < a
          result << "|:" + a_list[row-1]
          row -= 1
          col -= 1
        else
          result << "+:" + b_list[col-1]
          col -= 1
        end
      end
    end

    while col > 0 do
      result << "+:" + b_list[col-1]
      col -= 1
    end

    while row > 0 do
      result << "-:" + a_list[row-1]
      row -= 1
    end

    result.reverse!
    puts result

  end

  module_function :getOperation
end