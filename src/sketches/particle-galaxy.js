// パーティクル銀河 — 大量の粒子を3D空間で螺旋状に配置
export default function (p) {
  const W = 400;
  const H = 400;

  const NUM_PARTICLES = 4000;
  const NUM_ARMS = 2;
  const BULGE_RATIO = 0.25; // 中央バルジに配置する粒子の割合

  let particles = [];
  let autoRotate = true;
  let angle = 0;

  p.setup = () => {
    p.createCanvas(W, H, p.WEBGL);
    p.colorMode(p.HSB, 360, 100, 100, 1.0);
    generateGalaxy();
  };

  function generateGalaxy() {
    particles = [];

    const bulgeCount = Math.floor(NUM_PARTICLES * BULGE_RATIO);
    const armCount = NUM_PARTICLES - bulgeCount;

    // 中央バルジ — ガウス分布で球状に密集
    for (let i = 0; i < bulgeCount; i++) {
      const r = gaussianRandom() * 30;
      const theta = p.random(p.TWO_PI);
      const phi = p.random(p.PI);

      const x = r * p.sin(phi) * p.cos(theta);
      const y = (r * p.cos(phi)) * 0.4; // 縦方向を圧縮
      const z = r * p.sin(phi) * p.sin(theta);

      // 中心ほど明るく暖色
      const dist = p.mag(x, y, z);
      const hue = p.map(dist, 0, 40, 40, 30); // 黄〜オレンジ
      const sat = p.map(dist, 0, 40, 20, 50);
      const bri = p.map(dist, 0, 40, 100, 70);
      const size = p.map(dist, 0, 40, 3.5, 1.5);

      particles.push({ x, y, z, hue, sat, bri, size });
    }

    // 渦巻き腕
    const particlesPerArm = Math.floor(armCount / NUM_ARMS);
    for (let arm = 0; arm < NUM_ARMS; arm++) {
      const armOffset = (p.TWO_PI / NUM_ARMS) * arm;

      for (let i = 0; i < particlesPerArm; i++) {
        // 中心から外側へ対数螺旋的に分布
        const t = p.random(0.1, 1.0);
        const radius = t * 150;

        // 螺旋角度: 距離に応じて巻く
        const spiralAngle = armOffset + t * 3.5 + p.random(-0.3, 0.3);

        // 腕からの散らばり（外側ほど広がる）
        const spread = t * 20;
        const offsetX = gaussianRandom() * spread;
        const offsetZ = gaussianRandom() * spread;

        const x = p.cos(spiralAngle) * radius + offsetX;
        const z = p.sin(spiralAngle) * radius + offsetZ;
        // 薄い円盤: Y方向の厚みは小さい
        const y = gaussianRandom() * (3 + t * 5);

        // 色: 内側は暖色、外側は青白い
        const hue = p.map(t, 0.1, 1.0, 35, 220);
        const sat = p.map(t, 0.1, 1.0, 40, 60) + p.random(-10, 10);
        const bri = p.map(t, 0.1, 1.0, 95, 65) + p.random(-10, 10);
        const size = p.map(t, 0.1, 1.0, 2.5, 1.0) + p.random(-0.3, 0.3);

        particles.push({
          x, y, z,
          hue: p.constrain(hue, 0, 360),
          sat: p.constrain(sat, 0, 100),
          bri: p.constrain(bri, 0, 100),
          size: p.max(size, 0.5),
        });
      }
    }
  }

  // Box-Muller 変換による正規分布乱数
  function gaussianRandom() {
    let u = 0, v = 0;
    while (u === 0) u = p.random();
    while (v === 0) v = p.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(p.TWO_PI * v);
  }

  p.draw = () => {
    p.background(240, 30, 5);

    // カメラ操作
    p.orbitControl(2, 2, 0.05);

    // 自動回転
    if (autoRotate) {
      angle += 0.003;
    }

    // 少し傾けて見下ろす角度に
    p.rotateX(0.6);
    p.rotateY(angle);

    // パーティクル描画
    p.noFill();
    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];
      p.stroke(pt.hue, pt.sat, pt.bri, 0.85);
      p.strokeWeight(pt.size);
      p.point(pt.x, pt.y, pt.z);
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
    const rotText = autoRotate ? "ON" : "OFF";
    p.text(
      `ドラッグ: 回転｜スクロール: ズーム｜クリック: 自動回転 ${rotText}`,
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
}
