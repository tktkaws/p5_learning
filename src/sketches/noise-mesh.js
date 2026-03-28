// ノイズによるメッシュ変形 — グリッド頂点をPerlinノイズで揺らすワイヤーフレーム
export default function (p) {
  const W = 400;
  const H = 400;

  const cols = 30;
  const rows = 30;
  const cellW = W / cols;
  const cellH = H / rows;

  const noiseScale = 0.06;
  const amplitude = 40;
  let time = 0;

  // マウス波紋
  let ripples = [];

  p.setup = () => {
    p.createCanvas(W, H);
    p.colorMode(p.HSB, 360, 100, 100, 100);
  };

  p.draw = () => {
    p.background(220, 15, 12);
    time += 0.008;

    // 波紋の減衰
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].age += 0.02;
      if (ripples[i].age > 1) {
        ripples.splice(i, 1);
      }
    }

    // 頂点の高さを計算
    const heights = [];
    for (let row = 0; row <= rows; row++) {
      heights[row] = [];
      for (let col = 0; col <= cols; col++) {
        const x = col * cellW;
        const y = row * cellH;

        // Perlinノイズによる基本変位
        let h = p.noise(col * noiseScale * 3, row * noiseScale * 3, time) * amplitude;

        // マウスが canvas 内にあれば、マウス周辺を追加で盛り上げる
        if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
          const dx = x - p.mouseX;
          const dy = y - p.mouseY;
          const dist = p.sqrt(dx * dx + dy * dy);
          const influence = p.exp(-dist * dist / 4000);
          h += influence * 25;
        }

        // クリック波紋
        for (const r of ripples) {
          const dx = x - r.x;
          const dy = y - r.y;
          const dist = p.sqrt(dx * dx + dy * dy);
          const wave = p.sin(dist * 0.08 - r.age * 12) * (1 - r.age);
          h += wave * 20;
        }

        heights[row][col] = h;
      }
    }

    // アイソメトリック風の投影パラメータ
    const tiltX = 0.55;
    const tiltY = 0.35;
    const offsetX = W * 0.5;
    const offsetY = H * 0.15;
    const scaleX = W * 0.9 / cols;
    const scaleY = H * 0.9 / rows;

    // 2D座標に投影する関数
    function project(col, row, h) {
      const px = offsetX + (col - cols / 2) * scaleX * tiltX + (row - rows / 2) * scaleX * tiltX * 0.1;
      const py = offsetY + (row - rows / 2) * scaleY * tiltY - h + (col - cols / 2) * scaleY * 0.08;
      return { x: px, y: py };
    }

    // ワイヤーフレーム描画（奥から手前へ）
    p.strokeWeight(0.8);
    p.noFill();

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const h = heights[row][col];
        const hue = p.map(h, -20, amplitude + 25, 200, 360) % 360;
        const brightness = p.map(h, -20, amplitude + 25, 40, 95);
        p.stroke(hue, 70, brightness, 80);

        const pt = project(col, row, h);

        // 右方向の線
        if (col < cols) {
          const hR = heights[row][col + 1];
          const ptR = project(col + 1, row, hR);
          p.line(pt.x, pt.y, ptR.x, ptR.y);
        }

        // 下方向の線
        if (row < rows) {
          const hD = heights[row + 1][col];
          const ptD = project(col, row + 1, hD);
          p.line(pt.x, pt.y, ptD.x, ptD.y);
        }
      }
    }

    // 操作説明
    p.noStroke();
    p.fill(0, 0, 0, 50);
    p.rect(0, H - 28, W, 28);
    p.fill(0, 0, 90);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("マウスを動かして波を起こす｜クリックで波紋", W / 2, H - 14);
  };

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      ripples.push({ x: p.mouseX, y: p.mouseY, age: 0 });
    }
  };
}
