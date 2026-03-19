/** ピクセルソート — 画像のピクセルを明度で並び替えるグリッチアート。loadPixels()の活用 */
export default function (p) {
  let srcGraphics;
  const W = 400;
  const H = 400;

  // ---- プロシージャル画像の生成 ----

  function generateSource() {
    srcGraphics = p.createGraphics(W, H);
    srcGraphics.pixelDensity(1);

    // 背景グラデーション
    for (let y = 0; y < H; y++) {
      const t = y / H;
      srcGraphics.stroke(
        p.lerpColor(p.color(20, 60, 120), p.color(200, 80, 60), t)
      );
      srcGraphics.line(0, y, W, y);
    }

    // ノイズテクスチャ
    srcGraphics.loadPixels();
    for (let i = 0; i < srcGraphics.pixels.length; i += 4) {
      const n = (p.noise(i * 0.0003) - 0.5) * 60;
      srcGraphics.pixels[i] += n;
      srcGraphics.pixels[i + 1] += n;
      srcGraphics.pixels[i + 2] += n;
    }
    srcGraphics.updatePixels();

    // カラフルな円
    srcGraphics.noStroke();
    const circles = [
      { x: 100, y: 120, r: 90, c: [255, 180, 50, 200] },
      { x: 260, y: 100, r: 70, c: [50, 200, 255, 180] },
      { x: 180, y: 280, r: 100, c: [220, 60, 180, 170] },
      { x: 320, y: 300, r: 60, c: [100, 255, 120, 190] },
      { x: 60, y: 320, r: 50, c: [255, 100, 100, 160] },
      { x: 200, y: 60, r: 40, c: [180, 160, 255, 180] },
    ];
    for (const ci of circles) {
      for (let r = ci.r; r > 0; r -= 2) {
        const t = r / ci.r;
        srcGraphics.fill(ci.c[0], ci.c[1], ci.c[2], ci.c[3] * t);
        srcGraphics.ellipse(ci.x, ci.y, r * 2, r * 2);
      }
    }

    // 斜めストライプ
    srcGraphics.strokeWeight(3);
    for (let i = -W; i < W * 2; i += 30) {
      srcGraphics.stroke(255, 255, 255, 30);
      srcGraphics.line(i, 0, i + H, H);
    }
  }

  // ---- ピクセルの明度を計算 ----

  function brightness(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // ---- 1行のピクセルソート ----

  function sortRow(pixels, y, threshold) {
    const rowStart = y * W * 4;

    // 閾値を超えるピクセルの連続区間を探してソート
    let x = 0;
    while (x < W) {
      // 閾値を超える区間の開始を探す
      while (x < W) {
        const idx = rowStart + x * 4;
        const b = brightness(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
        if (b > threshold) break;
        x++;
      }
      const start = x;

      // 区間の終端を探す
      while (x < W) {
        const idx = rowStart + x * 4;
        const b = brightness(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
        if (b <= threshold) break;
        x++;
      }
      const end = x;

      if (end - start < 2) continue;

      // 区間のピクセルを抽出
      const segment = [];
      for (let i = start; i < end; i++) {
        const idx = rowStart + i * 4;
        segment.push({
          r: pixels[idx],
          g: pixels[idx + 1],
          b: pixels[idx + 2],
          a: pixels[idx + 3],
          bright: brightness(pixels[idx], pixels[idx + 1], pixels[idx + 2]),
        });
      }

      // 明度でソート
      segment.sort((a, b) => a.bright - b.bright);

      // 書き戻す
      for (let i = 0; i < segment.length; i++) {
        const idx = rowStart + (start + i) * 4;
        pixels[idx] = segment[i].r;
        pixels[idx + 1] = segment[i].g;
        pixels[idx + 2] = segment[i].b;
        pixels[idx + 3] = segment[i].a;
      }
    }
  }

  p.setup = () => {
    p.createCanvas(W, H);
    p.pixelDensity(1);
    generateSource();
  };

  p.draw = () => {
    // マウスY で閾値を制御（0〜255）
    const inCanvas =
      p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H;
    const threshold = inCanvas ? p.map(p.mouseY, 0, H, 0, 255) : 128;

    // ソース画像をキャンバスにコピー
    p.image(srcGraphics, 0, 0);
    p.loadPixels();

    // 各行をピクセルソート
    for (let y = 0; y < H; y++) {
      sortRow(p.pixels, y, threshold);
    }
    p.updatePixels();

    // ガイドUI
    p.noStroke();
    p.fill(0, 160);
    p.rect(0, H - 32, W, 32);
    p.fill(255, 200);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      "明度の閾値: " + Math.floor(threshold) + " — マウス上下で調整",
      W / 2,
      H - 16
    );

    // 閾値インジケーター
    const indicatorX = p.map(threshold, 0, 255, 10, W - 10);
    p.fill(255, 100);
    p.rect(10, H - 36, W - 20, 3, 2);
    p.fill(255, 230);
    p.ellipse(indicatorX, H - 34.5, 8, 8);
  };

  // クリックで元画像を再生成
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      generateSource();
    }
  };
}
