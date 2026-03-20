/** 地形ジェネレーション — 2Dノイズで高さマップを作り、色分けして島・山・海を表現 */
export default function (p) {
  const W = 400;
  const H = 400;
  const SCALE = 0.008;
  let seed;

  // 高さに応じた地形の色
  function terrainColor(h) {
    if (h < 0.35) return p.color(30, 60, 120); // 深海
    if (h < 0.42) return p.color(50, 100, 180); // 浅海
    if (h < 0.45) return p.color(210, 200, 150); // 砂浜
    if (h < 0.55) return p.color(60, 160, 60); // 草地
    if (h < 0.65) return p.color(30, 120, 30); // 森
    if (h < 0.78) return p.color(100, 80, 60); // 山
    if (h < 0.88) return p.color(130, 110, 90); // 高山
    return p.color(240, 240, 245); // 雪
  }

  function generate() {
    seed = p.random(10000);
    p.noiseSeed(seed);

    p.loadPixels();

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        // 複数オクターブのノイズ
        let nx = x * SCALE;
        let ny = y * SCALE;
        let h =
          p.noise(nx, ny) * 1.0 +
          p.noise(nx * 2, ny * 2) * 0.5 +
          p.noise(nx * 4, ny * 4) * 0.25;
        h /= 1.75; // 正規化

        // 島らしくするため、端を沈める
        const dx = (x - W / 2) / (W / 2);
        const dy = (y - H / 2) / (H / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        h -= dist * 0.4;
        h = p.constrain(h, 0, 1);

        const c = terrainColor(h);
        const idx = (y * W + x) * 4;
        p.pixels[idx] = p.red(c);
        p.pixels[idx + 1] = p.green(c);
        p.pixels[idx + 2] = p.blue(c);
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
    p.text(
      "\u30AF\u30EA\u30C3\u30AF\u3067\u65B0\u3057\u3044\u5730\u5F62\u3092\u751F\u6210",
      W / 2,
      H - 16
    );
  }

  p.setup = () => {
    p.createCanvas(W, H);
    p.pixelDensity(1);
    p.noLoop();
    generate();
  };

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      generate();
    }
  };
}
