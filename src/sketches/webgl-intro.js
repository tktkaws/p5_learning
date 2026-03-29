// WEBGL入門 — 3Dプリミティブの描画とカメラ操作
export default function (p) {
  const W = 400;
  const H = 400;

  const shapes = [
    { name: "box", draw: (s) => p.box(s) },
    { name: "sphere", draw: (s) => p.sphere(s * 0.55) },
    { name: "torus", draw: (s) => p.torus(s * 0.4, s * 0.15) },
    { name: "cylinder", draw: (s) => p.cylinder(s * 0.35, s * 0.8) },
    { name: "cone", draw: (s) => p.cone(s * 0.4, s * 0.8) },
  ];

  const colors = [
    [350, 70, 90], // 赤
    [40, 80, 95],  // オレンジ
    [160, 60, 85], // ティール
    [220, 65, 90], // 青
    [280, 55, 85], // 紫
  ];

  let autoRotate = true;
  let angle = 0;

  p.setup = () => {
    p.createCanvas(W, H, p.WEBGL);
    p.colorMode(p.HSB, 360, 100, 100);
  };

  p.draw = () => {
    p.background(220, 10, 12);

    // カメラ操作
    p.orbitControl(2, 2, 0.05);

    // ライティング
    p.ambientLight(0, 0, 30);
    p.directionalLight(0, 0, 80, 0.5, -1, -0.5);
    p.directionalLight(220, 30, 40, -0.5, 0.5, -0.3);

    // 自動回転
    if (autoRotate) {
      angle += 0.005;
    }

    // 床のグリッド
    p.push();
    p.translate(0, 80, 0);
    p.rotateX(p.HALF_PI);
    p.noFill();
    p.stroke(0, 0, 25);
    p.strokeWeight(0.5);
    const gridSize = 300;
    const step = 30;
    for (let x = -gridSize; x <= gridSize; x += step) {
      p.line(x, -gridSize, x, gridSize);
    }
    for (let y = -gridSize; y <= gridSize; y += step) {
      p.line(-gridSize, y, gridSize, y);
    }
    p.pop();

    // 5つの図形を円形に配置
    const radius = 100;
    for (let i = 0; i < shapes.length; i++) {
      const a = angle + (p.TWO_PI / shapes.length) * i;
      const x = p.cos(a) * radius;
      const z = p.sin(a) * radius;

      p.push();
      p.translate(x, 0, z);
      // 各図形の自転
      p.rotateY(p.frameCount * 0.02);
      p.rotateX(p.frameCount * 0.01);

      // マテリアル
      p.noStroke();
      p.ambientMaterial(colors[i][0], colors[i][1], colors[i][2]);

      shapes[i].draw(55);
      p.pop();
    }

    // 中央の小さい球（光源マーカー風）
    p.push();
    p.translate(0, 0, 0);
    p.noStroke();
    p.emissiveMaterial(50, 60, 95);
    p.sphere(8);
    p.pop();

    // UI（2D オーバーレイ）
    drawUI();
  };

  function drawUI() {
    // WEBGL座標系をリセットしてスクリーン座標で描画
    p.push();
    p.resetMatrix();
    p.ortho();
    p.translate(-W / 2, -H / 2);
    p.noLights();

    p.noStroke();
    p.fill(0, 0, 5, 0.7);
    p.rect(0, H - 24, W, 24);

    p.fill(0, 0, 80);
    p.textSize(10);
    p.textFont("sans-serif");
    p.textAlign(p.CENTER, p.CENTER);
    const rotText = autoRotate ? "ON" : "OFF";
    p.text(
      `ドラッグ: 回転｜スクロール: ズーム｜クリック: 自動回転 ${rotText}｜R: リセット`,
      W / 2,
      H - 12
    );
    p.pop();
  }

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      autoRotate = !autoRotate;
    }
  };

  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") {
      autoRotate = true;
      angle = 0;
    }
  };
}
