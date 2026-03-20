/** モアレパターン — 2つの重なる縞模様が干渉して生まれる視覚効果。回転・拡大で変化 */
export default function (p) {
  const W = 400;
  const H = 400;
  const BASE_SPACING = 8;

  p.setup = () => {
    p.createCanvas(W, H);
    p.pixelDensity(1);
  };

  p.draw = () => {
    const inCanvas =
      p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H;
    const angle = inCanvas ? p.map(p.mouseX, 0, W, 0, p.PI) : p.PI / 6;
    const spacing = inCanvas ? p.map(p.mouseY, 0, H, 3, 20) : BASE_SPACING;

    const cx = W / 2;
    const cy = H / 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    p.loadPixels();

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        // パターン1: 垂直な縞（固定）
        const s1 = ((Math.floor(x / BASE_SPACING) % 2) + 2) % 2;

        // パターン2: 回転した縞（マウスで制御）
        const dx = x - cx;
        const dy = y - cy;
        const projected = dx * cosA + dy * sinA;
        const s2 = ((Math.floor(projected / spacing) % 2) + 2) % 2;

        // XOR で干渉パターンを生成
        const val = s1 ^ s2 ? 255 : 0;

        const idx = (y * W + x) * 4;
        p.pixels[idx] = val;
        p.pixels[idx + 1] = val;
        p.pixels[idx + 2] = val;
        p.pixels[idx + 3] = 255;
      }
    }

    p.updatePixels();

    // ガイドUI
    p.noStroke();
    p.fill(0, 160);
    p.rect(0, H - 32, W, 32);
    p.fill(255, 200);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    const angleDeg = Math.round(p.degrees(angle));
    p.text(
      "\u89D2\u5EA6: " +
        angleDeg +
        "\u00B0  \u9593\u968C: " +
        spacing.toFixed(1) +
        "px \u2014 \u30DE\u30A6\u30B9\u3067\u64CD\u4F5C",
      W / 2,
      H - 16
    );
  };
}
