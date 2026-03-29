// Wave Function Collapse — パイプ/回路風タイルの制約伝搬アルゴリズム
export default function (p) {
  const W = 400;
  const H = 400;
  const CELL = 20;
  const COLS = W / CELL;
  const ROWS = H / CELL;

  // タイル定義: edges = [N, E, S, W], 0=閉, 1=開
  const TILES = [
    { edges: [0, 0, 0, 0], weight: 4 },  //  0: 空白
    { edges: [0, 1, 0, 1], weight: 6 },  //  1: ─ 横線
    { edges: [1, 0, 1, 0], weight: 6 },  //  2: │ 縦線
    { edges: [1, 1, 0, 0], weight: 4 },  //  3: └ 左下角
    { edges: [0, 1, 1, 0], weight: 4 },  //  4: ┌ 左上角
    { edges: [0, 0, 1, 1], weight: 4 },  //  5: ┐ 右上角
    { edges: [1, 0, 0, 1], weight: 4 },  //  6: ┘ 右下角
    { edges: [0, 1, 1, 1], weight: 2 },  //  7: ┬ T字(N閉)
    { edges: [1, 1, 1, 0], weight: 2 },  //  8: ├ T字(W閉)
    { edges: [1, 1, 0, 1], weight: 2 },  //  9: ┴ T字(S閉)
    { edges: [1, 0, 1, 1], weight: 2 },  // 10: ┤ T字(E閉)
    { edges: [1, 1, 1, 1], weight: 1 },  // 11: ┼ 十字
  ];

  const N_TILES = TILES.length;
  const OPP = [2, 3, 0, 1]; // 対辺: N→S, E→W, S→N, W→E
  const DR = [-1, 0, 1, 0];
  const DC = [0, 1, 0, -1];

  // 互換性テーブルを事前計算
  // compat[d][tileA] = Set of tiles valid for neighbor in direction d
  const compat = [];
  for (let d = 0; d < 4; d++) {
    compat[d] = [];
    for (let a = 0; a < N_TILES; a++) {
      const set = new Set();
      const edgeVal = TILES[a].edges[d];
      for (let b = 0; b < N_TILES; b++) {
        if (TILES[b].edges[OPP[d]] === edgeVal) set.add(b);
      }
      compat[d][a] = set;
    }
  }

  let grid;
  let collapseCount;
  let totalCells;
  let done;
  let hasContradiction;
  let cellsPerFrame;
  const speeds = [1, 3, 10, 50];
  let speedIdx;

  p.setup = () => {
    p.createCanvas(W, H);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    totalCells = ROWS * COLS;
    reset();
  };

  function reset() {
    grid = [];
    collapseCount = 0;
    done = false;
    hasContradiction = false;
    speedIdx = 1;
    cellsPerFrame = speeds[speedIdx];

    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        const opts = new Uint8Array(N_TILES);
        opts.fill(1); // 全タイルが候補
        grid[r][c] = { opts, count: N_TILES, collapsed: false, tile: -1, order: -1 };
      }
    }
  }

  p.draw = () => {
    p.background(15, 10, 8);

    if (!done && !hasContradiction) {
      for (let i = 0; i < cellsPerFrame; i++) {
        if (!stepCollapse()) break;
      }
    }

    drawGrid();
    drawUI();
  };

  function stepCollapse() {
    // 最小エントロピーのセルを探す
    let minCount = Infinity;
    let candidates = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell.collapsed) continue;
        if (cell.count === 0) {
          hasContradiction = true;
          return false;
        }
        // ノイズを加えてタイブレイク
        const entropy = cell.count + p.random(0.1);
        if (entropy < minCount) {
          minCount = entropy;
          candidates = [{ r, c }];
        } else if (entropy < minCount + 0.5 && cell.count === Math.floor(minCount)) {
          candidates.push({ r, c });
        }
      }
    }

    if (candidates.length === 0) {
      done = true;
      return false;
    }

    // ランダムに選択
    const { r, c } = candidates[p.floor(p.random(candidates.length))];
    const cell = grid[r][c];

    // 重み付きランダムでタイルを選択
    let totalW = 0;
    for (let i = 0; i < N_TILES; i++) {
      if (cell.opts[i]) totalW += TILES[i].weight;
    }
    let rand = p.random(totalW);
    let chosen = -1;
    for (let i = 0; i < N_TILES; i++) {
      if (!cell.opts[i]) continue;
      rand -= TILES[i].weight;
      if (rand <= 0) {
        chosen = i;
        break;
      }
    }
    if (chosen === -1) chosen = 0; // fallback

    // 崩壊
    cell.opts.fill(0);
    cell.opts[chosen] = 1;
    cell.count = 1;
    cell.collapsed = true;
    cell.tile = chosen;
    cell.order = collapseCount++;

    // 制約伝搬
    propagate(r, c);

    return !hasContradiction;
  }

  function propagate(startR, startC) {
    const stack = [startR * COLS + startC];
    const inStack = new Uint8Array(ROWS * COLS);
    inStack[startR * COLS + startC] = 1;

    while (stack.length > 0) {
      const idx = stack.pop();
      const r = Math.floor(idx / COLS);
      const c = idx % COLS;
      inStack[idx] = 0;
      const cell = grid[r][c];

      for (let d = 0; d < 4; d++) {
        const nr = r + DR[d];
        const nc = c + DC[d];
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;

        const neighbor = grid[nr][nc];
        if (neighbor.collapsed) continue;

        // 現在のセルから方向dに許容されるタイルの集合を求める
        let changed = false;
        for (let nb = 0; nb < N_TILES; nb++) {
          if (!neighbor.opts[nb]) continue;
          // nbが隣接可能かチェック: 現在セルのいずれかの候補と互換性があるか
          let valid = false;
          for (let a = 0; a < N_TILES; a++) {
            if (cell.opts[a] && compat[d][a].has(nb)) {
              valid = true;
              break;
            }
          }
          if (!valid) {
            neighbor.opts[nb] = 0;
            neighbor.count--;
            changed = true;
          }
        }

        if (changed) {
          if (neighbor.count === 0) {
            hasContradiction = true;
            return;
          }
          const nIdx = nr * COLS + nc;
          if (!inStack[nIdx]) {
            stack.push(nIdx);
            inStack[nIdx] = 1;
          }
        }
      }
    }
  }

  function drawGrid() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        const x = c * CELL;
        const y = r * CELL;

        if (cell.collapsed) {
          const edges = TILES[cell.tile].edges;
          const hue = (cell.order / totalCells) * 300;
          drawTile(x, y, edges, hue);
        } else {
          // エントロピー表示
          const ratio = 1 - cell.count / N_TILES;
          p.noStroke();
          p.fill(200, 5, 6 + ratio * 10);
          p.rect(x, y, CELL, CELL);
        }
      }
    }
  }

  function drawTile(x, y, edges, hue) {
    const cx = x + CELL / 2;
    const cy = y + CELL / 2;
    const hasConn = edges[0] || edges[1] || edges[2] || edges[3];

    // 背景
    p.noStroke();
    p.fill(hue, 20, 12);
    p.rect(x, y, CELL, CELL);

    if (!hasConn) return;

    // パイプ描画
    p.stroke(hue, 65, 85);
    p.strokeWeight(3);
    p.strokeCap(p.ROUND);

    if (edges[0]) p.line(cx, cy, cx, y);       // N
    if (edges[1]) p.line(cx, cy, x + CELL, cy); // E
    if (edges[2]) p.line(cx, cy, cx, y + CELL);  // S
    if (edges[3]) p.line(cx, cy, x, cy);         // W

    // 接続ノード
    const connCount = edges[0] + edges[1] + edges[2] + edges[3];
    if (connCount >= 2) {
      p.noStroke();
      p.fill(hue, 60, 95);
      p.circle(cx, cy, 5);
    }
  }

  function drawUI() {
    p.noStroke();
    p.fill(0, 0, 5, 85);
    p.rect(0, H - 22, W, 22);

    let msg;
    if (hasContradiction) {
      msg = "矛盾発生！ クリック: 再生成";
    } else if (done) {
      msg = "完了｜クリック: 再生成";
    } else {
      msg = `崩壊中… ${collapseCount}/${totalCells}`;
    }

    p.fill(0, 0, 75);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(msg + `｜速度: ${cellsPerFrame}/f｜↑↓: 速度｜R: リセット`, W / 2, H - 11);
  }

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      reset();
    }
  };

  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") {
      reset();
    } else if (p.keyCode === p.UP_ARROW) {
      speedIdx = p.min(speedIdx + 1, speeds.length - 1);
      cellsPerFrame = speeds[speedIdx];
    } else if (p.keyCode === p.DOWN_ARROW) {
      speedIdx = p.max(speedIdx - 1, 0);
      cellsPerFrame = speeds[speedIdx];
    }
  };
}
