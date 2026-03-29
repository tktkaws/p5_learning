// メタボール — 複数の点が生む等値面を有機的に描画
export default function (p) {
  const W = 400;
  const H = 400;
  const RES = 4; // ピクセル解像度（4px単位で計算）
  const GW = W / RES;
  const GH = H / RES;

  let balls = [];
  let img;

  p.setup = () => {
    p.createCanvas(W, H);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    img = p.createImage(GW, GH);
    initBalls();
  };

  function initBalls() {
    balls = [];
    // 自動移動ボール5個
    for (let i = 0; i < 5; i++) {
      balls.push({
        x: p.random(50, W - 50),
        y: p.random(50, H - 50),
        vx: p.random(-1.5, 1.5) || 0.5,
        vy: p.random(-1.5, 1.5) || 0.5,
        r: p.random(40, 70),
        isMouse: false,
      });
    }
    // マウス追従ボール1個
    balls.push({
      x: W / 2,
      y: H / 2,
      vx: 0,
      vy: 0,
      r: 60,
      isMouse: true,
    });
  }

  p.draw = () => {
    updateBalls();
    renderMetaballs();
    p.image(img, 0, 0, W, H);
    drawUI();
  };

  function updateBalls() {
    for (const b of balls) {
      if (b.isMouse) {
        // マウスに向かって滑らかに追従
        b.x += (p.mouseX - b.x) * 0.08;
        b.y += (p.mouseY - b.y) * 0.08;
        continue;
      }
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < b.r || b.x > W - b.r) b.vx *= -1;
      if (b.y < b.r || b.y > H - b.r) b.vy *= -1;
      b.x = p.constrain(b.x, b.r, W - b.r);
      b.y = p.constrain(b.y, b.r, H - b.r);
    }
  }

  function renderMetaballs() {
    img.loadPixels();
    for (let gy = 0; gy < GH; gy++) {
      const py = gy * RES + RES / 2;
      for (let gx = 0; gx < GW; gx++) {
        const px = gx * RES + RES / 2;

        // 影響値の合計
        let sum = 0;
        for (const b of balls) {
          const dx = px - b.x;
          const dy = py - b.y;
          const distSq = dx * dx + dy * dy;
          sum += (b.r * b.r) / distSq;
        }

        // 影響値を色に変換（溶岩ランプ風）
        let r, g, bl;
        if (sum > 1.0) {
          // 内側: 暖色グラデーション（黄→赤）
          const t = p.constrain((sum - 1.0) / 1.5, 0, 1);
          r = 255;
          g = p.lerp(100, 220, 1 - t);
          bl = p.lerp(0, 30, 1 - t);
        } else if (sum > 0.5) {
          // 中間: 寒色→暖色の遷移（紫→赤）
          const t = (sum - 0.5) / 0.5;
          r = p.lerp(80, 255, t);
          g = p.lerp(20, 100, t);
          bl = p.lerp(180, 0, t);
        } else if (sum > 0.2) {
          // 外縁: 暗い青〜紫
          const t = (sum - 0.2) / 0.3;
          r = p.lerp(10, 80, t);
          g = p.lerp(5, 20, t);
          bl = p.lerp(30, 180, t);
        } else {
          // 背景: ほぼ黒
          const t = sum / 0.2;
          r = p.lerp(5, 10, t);
          g = p.lerp(3, 5, t);
          bl = p.lerp(8, 30, t);
        }

        const idx = (gy * GW + gx) * 4;
        img.pixels[idx] = r;
        img.pixels[idx + 1] = g;
        img.pixels[idx + 2] = bl;
        img.pixels[idx + 3] = 255;
      }
    }
    img.updatePixels();
  }

  function drawUI() {
    p.noStroke();
    p.fill(0, 0, 0, 70);
    p.rect(0, H - 22, W, 22);

    p.fill(0, 0, 85);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      `ボール: ${balls.length}個｜クリック: 追加｜R: リセット｜D: 削除`,
      W / 2,
      H - 11
    );
  }

  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > W || p.mouseY < 0 || p.mouseY > H) return;
    // 新しいボールを追加（最大12個）
    if (balls.length < 12) {
      balls.push({
        x: p.mouseX,
        y: p.mouseY,
        vx: p.random(-1.5, 1.5) || 0.5,
        vy: p.random(-1.5, 1.5) || 0.5,
        r: p.random(40, 70),
        isMouse: false,
      });
    }
  };

  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") {
      initBalls();
    } else if (p.key === "d" || p.key === "D") {
      // マウスボール以外で最後のボールを削除（最低2個は残す）
      const nonMouse = balls.filter((b) => !b.isMouse);
      if (nonMouse.length > 1) {
        const last = nonMouse[nonMouse.length - 1];
        balls.splice(balls.indexOf(last), 1);
      }
    }
  };
}
