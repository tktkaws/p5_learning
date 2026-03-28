// ランダムウォーク — 均一ランダム / 正規分布 / レヴィフライトの3種を比較
export default function (p) {
  const W = 400;
  const H = 400;

  const types = ["uniform", "gaussian", "levy"];
  const typeNames = ["均一ランダム", "正規分布（ガウシアン）", "レヴィフライト"];
  const typeColors = [
    [80, 200, 255],   // 水色
    [255, 160, 80],   // オレンジ
    [120, 255, 140],  // 緑
  ];
  let typeIndex = 0;

  let x, y;
  let prevX, prevY;
  let steps;
  const stepsPerFrame = 3;

  p.setup = () => {
    p.createCanvas(W, H);
    reset();
  };

  function reset() {
    p.background(15, 15, 25);
    x = W / 2;
    y = H / 2;
    prevX = x;
    prevY = y;
    steps = 0;
    drawUI();
  }

  p.draw = () => {
    for (let i = 0; i < stepsPerFrame; i++) {
      prevX = x;
      prevY = y;

      switch (types[typeIndex]) {
        case "uniform":
          stepUniform();
          break;
        case "gaussian":
          stepGaussian();
          break;
        case "levy":
          stepLevy();
          break;
      }

      // 画面端で跳ね返り
      x = p.constrain(x, 0, W);
      y = p.constrain(y, 0, H - 28);

      // 軌跡を描画
      const col = typeColors[typeIndex];
      p.stroke(col[0], col[1], col[2], 60);
      p.strokeWeight(1.2);
      p.line(prevX, prevY, x, y);

      steps++;
    }

    // 現在位置マーカー
    const col = typeColors[typeIndex];
    p.noStroke();
    p.fill(col[0], col[1], col[2]);
    p.ellipse(x, y, 5, 5);

    drawUI();
  };

  // 均一ランダム: 4方向にstepSize固定で移動
  function stepUniform() {
    const stepSize = 5;
    const dir = p.floor(p.random(4));
    if (dir === 0) x += stepSize;
    else if (dir === 1) x -= stepSize;
    else if (dir === 2) y += stepSize;
    else y -= stepSize;
  }

  // 正規分布: ガウシアン乱数で連続方向に移動
  function stepGaussian() {
    x += p.randomGaussian(0, 3);
    y += p.randomGaussian(0, 3);
  }

  // レヴィフライト: 普段は小さく、たまに大きくジャンプ
  function stepLevy() {
    const angle = p.random(p.TWO_PI);
    let stepSize;

    // べき乗分布: u^(-1/α) でα=1.5
    const u = p.random(0.001, 1);
    stepSize = p.pow(u, -1 / 1.5) * 0.8;
    stepSize = p.min(stepSize, 80);

    x += p.cos(angle) * stepSize;
    y += p.sin(angle) * stepSize;
  }

  function drawUI() {
    p.noStroke();
    p.fill(15, 15, 25, 220);
    p.rect(0, H - 28, W, 28);

    p.fill(typeColors[typeIndex][0], typeColors[typeIndex][1], typeColors[typeIndex][2]);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      typeNames[typeIndex] + "｜steps: " + steps + "｜クリック: 切替｜R: リセット",
      W / 2,
      H - 14
    );
  }

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      typeIndex = (typeIndex + 1) % types.length;
      reset();
    }
  };

  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") {
      reset();
    }
  };
}
