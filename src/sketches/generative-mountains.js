// ジェネラティブ山脈 — 1Dノイズの重ね合わせ + パララックス効果
export default function (p) {
  const W = 400;
  const H = 400;

  const layers = 6;
  let seed;

  p.setup = () => {
    p.createCanvas(W, H);
    p.noStroke();
    seed = p.floor(p.random(10000));
  };

  p.draw = () => {
    drawSky();
    drawSun();
    drawMountains();
    drawUI();
  };

  function drawSky() {
    // 夕焼けグラデーション（上: 紫 → 中: 橙 → 下: 赤橙）
    for (let y = 0; y < H; y++) {
      const t = y / H;
      let r, g, b;
      if (t < 0.5) {
        // 上半分: 紫(60,20,80) → 橙(240,130,60)
        const s = t / 0.5;
        r = p.lerp(60, 240, s);
        g = p.lerp(20, 130, s);
        b = p.lerp(80, 60, s);
      } else {
        // 下半分: 橙(240,130,60) → 赤橙(200,80,50)
        const s = (t - 0.5) / 0.5;
        r = p.lerp(240, 200, s);
        g = p.lerp(130, 80, s);
        b = p.lerp(60, 50, s);
      }
      p.stroke(r, g, b);
      p.line(0, y, W, y);
    }
    p.noStroke();
  }

  function drawSun() {
    // 太陽（地平線付近）
    const sunX = W * 0.65;
    const sunY = H * 0.42;
    const sunR = 30;

    // グロー
    for (let r = sunR * 3; r > sunR; r -= 2) {
      const a = p.map(r, sunR, sunR * 3, 40, 0);
      p.fill(255, 200, 100, a);
      p.ellipse(sunX, sunY, r * 2, r * 2);
    }

    // 太陽本体
    p.fill(255, 220, 150);
    p.ellipse(sunX, sunY, sunR * 2, sunR * 2);
  }

  function drawMountains() {
    // マウスによるパララックスオフセット（中央を基準に）
    const mx = p.mouseX >= 0 && p.mouseX <= W ? p.mouseX : W / 2;
    const parallaxBase = (mx - W / 2) / W; // -0.5 ~ 0.5

    p.noiseSeed(seed);

    for (let i = 0; i < layers; i++) {
      const depth = i / (layers - 1); // 0(奥) ~ 1(手前)

      // 奥ほど薄紫、手前ほど濃紺〜黒
      const r = p.lerp(120, 10, depth);
      const g = p.lerp(80, 8, depth);
      const b = p.lerp(130, 25, depth);
      const alpha = p.lerp(200, 255, depth);
      p.fill(r, g, b, alpha);

      // 各層のパラメータ
      const baseY = p.map(depth, 0, 1, H * 0.35, H * 0.7);
      const peakHeight = p.lerp(80, 140, depth);
      const noiseFreq = p.lerp(0.008, 0.015, depth);
      const parallaxAmount = depth * 60;
      const offsetX = parallaxBase * parallaxAmount;

      // ノイズのオフセット（層ごとに異なる領域を使用）
      const noiseOffsetY = i * 100;

      p.beginShape();
      p.vertex(0, H);
      for (let x = -20; x <= W + 20; x += 2) {
        const nx = (x - offsetX) * noiseFreq;

        // 複数オクターブの重ね合わせ
        let h = p.noise(nx, noiseOffsetY) * 1.0;
        h += p.noise(nx * 2, noiseOffsetY + 50) * 0.5;
        h += p.noise(nx * 4, noiseOffsetY + 100) * 0.25;
        h /= 1.75;

        const y = baseY - h * peakHeight;
        p.vertex(x, y);
      }
      p.vertex(W, H);
      p.endShape(p.CLOSE);
    }
  }

  function drawUI() {
    p.noStroke();
    p.fill(0, 0, 0, 60);
    p.rect(0, H - 28, W, 28);
    p.fill(255, 220, 180);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("マウスで視差移動｜クリックで山脈を再生成", W / 2, H - 14);
  }

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      seed = p.floor(p.random(10000));
    }
  };
}
