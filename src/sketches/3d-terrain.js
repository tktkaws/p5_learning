// 3D地形 — ノイズで生成した高さマップを三角メッシュで立体表示
export default function (p) {
  const W = 400;
  const H = 400;

  const cols = 50;
  const rows = 50;
  const scl = 8; // グリッドの間隔
  let flying = 0;

  // 高さに応じた地形色を返す
  function terrainColor(h) {
    // h: -1 ~ 1 程度の正規化された高さ
    if (h < -0.25) {
      // 深い水: 暗い青
      return p.color(210, 70, 40);
    } else if (h < 0.0) {
      // 浅い水: 明るい青
      return p.color(200, 60, 60);
    } else if (h < 0.2) {
      // 砂浜: 黄色っぽい
      return p.color(50, 40, 80);
    } else if (h < 0.5) {
      // 草原: 緑
      return p.color(120, 55, 55);
    } else if (h < 0.75) {
      // 山: 茶色
      return p.color(30, 50, 45);
    } else {
      // 雪: 白
      return p.color(0, 5, 95);
    }
  }

  p.setup = () => {
    p.createCanvas(W, H, p.WEBGL);
    p.colorMode(p.HSB, 360, 100, 100);
  };

  p.draw = () => {
    p.background(220, 15, 10);

    // カメラ操作
    p.orbitControl(2, 2, 0.05);

    // ライティング
    p.ambientLight(0, 0, 40);
    p.directionalLight(0, 0, 70, 0.5, -1, -0.5);

    // 地形を中心に配置
    p.translate(-cols * scl / 2, -rows * scl / 2, 0);
    // 斜め上から見やすい角度にデフォルト回転
    p.rotateX(p.PI / 3);

    // ノイズオフセットをアニメーション
    flying -= 0.008;

    const heightScale = 80;

    // 高さマップ生成
    const terrain = [];
    let yoff = flying;
    for (let y = 0; y <= rows; y++) {
      terrain[y] = [];
      let xoff = 0;
      for (let x = 0; x <= cols; x++) {
        terrain[y][x] = p.map(p.noise(xoff, yoff), 0, 1, -1, 1);
        xoff += 0.12;
      }
      yoff += 0.12;
    }

    // メッシュ描画（塗り + ワイヤーフレーム）
    for (let y = 0; y < rows; y++) {
      // 塗り面
      p.beginShape(p.TRIANGLE_STRIP);
      p.noStroke();
      for (let x = 0; x <= cols; x++) {
        const h1 = terrain[y][x];
        const h2 = terrain[y + 1][x];
        p.fill(terrainColor(h1));
        p.vertex(x * scl, y * scl, h1 * heightScale);
        p.fill(terrainColor(h2));
        p.vertex(x * scl, (y + 1) * scl, h2 * heightScale);
      }
      p.endShape();

      // ワイヤーフレーム
      p.beginShape(p.TRIANGLE_STRIP);
      p.stroke(0, 0, 100, 0.08);
      p.strokeWeight(0.5);
      p.noFill();
      for (let x = 0; x <= cols; x++) {
        const h1 = terrain[y][x];
        const h2 = terrain[y + 1][x];
        p.vertex(x * scl, y * scl, h1 * heightScale);
        p.vertex(x * scl, (y + 1) * scl, h2 * heightScale);
      }
      p.endShape();
    }

    // UI オーバーレイ
    drawUI();
  };

  function drawUI() {
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
    p.text(
      "ドラッグ: 回転｜スクロール: ズーム",
      W / 2,
      H - 12
    );
    p.pop();
  }
}
