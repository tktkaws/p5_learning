/** 円パッキング — 重ならないように円を敷き詰める */
export default function (p) {
  let mode = 0;
  const labels = ["ランダムパッキング", "画像ベース", "クリックで追加"];
  let circles = [];
  let growing = true;
  let pg = null;

  p.setup = () => {
    p.createCanvas(400, 400);
    setupImageBuffer();
    resetSketch();
  };

  function setupImageBuffer() {
    pg = p.createGraphics(p.width, p.height - 40);
    pg.background(0);
    pg.fill(255);
    pg.noStroke();
    pg.textSize(180);
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textStyle(p.BOLD);
    pg.text("p5", pg.width / 2, pg.height / 2);
    pg.loadPixels();
  }

  function getBrightness(x, y) {
    const ix = p.floor(p.constrain(x, 0, pg.width - 1));
    const iy = p.floor(p.constrain(y, 0, pg.height - 1));
    const idx = (iy * pg.width + ix) * 4;
    return pg.pixels[idx];
  }

  function resetSketch() {
    circles = [];
    growing = true;
  }

  p.draw = () => {
    p.background(15);

    if (mode === 0) {
      updateRandomPacking();
    } else if (mode === 1) {
      updateImagePacking();
    } else {
      updateInteractive();
    }

    // --- 円を描画 ---
    p.push();
    p.colorMode(p.HSB, 360, 100, 100);
    for (const c of circles) {
      p.noStroke();
      p.fill(c.hue, 55, 85, 0.75);
      p.circle(c.x, c.y, c.r * 2);
      p.stroke(c.hue, 65, 65);
      p.strokeWeight(0.8);
      p.noFill();
      p.circle(c.x, c.y, c.r * 2);
    }
    p.pop();

    // --- モード表示 ---
    p.noStroke();
    p.fill(15, 15, 15, 220);
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(180);
    p.textSize(13);
    p.textAlign(p.CENTER, p.CENTER);
    const label =
      mode === 2
        ? labels[mode] + "（バーで切替）"
        : labels[mode] + "（クリックで切替）";
    p.text(label, p.width / 2, p.height - 20);

    if (!growing && mode !== 2) {
      p.noLoop();
    }
  };

  function updateRandomPacking() {
    let added = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      const x = p.random(p.width);
      const y = p.random(p.height - 40);
      if (!overlaps(x, y, 2)) {
        circles.push({ x, y, r: 2, growing: true, hue: p.random(360) });
        added = true;
        break;
      }
    }
    if (!added) growing = false;
    growCircles();
  }

  function updateImagePacking() {
    let added = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      const x = p.random(p.width);
      const y = p.random(p.height - 40);
      const b = getBrightness(x, y);
      if (b > 128 && !overlaps(x, y, 2)) {
        circles.push({
          x,
          y,
          r: 2,
          growing: true,
          hue: p.map(b, 128, 255, 180, 320),
          maxR: p.map(b, 128, 255, 8, 30),
        });
        added = true;
        break;
      }
    }
    if (!added) growing = false;
    growCircles();
  }

  function updateInteractive() {
    growCircles();
    // 全ての円が成長完了したら停止
    const anyGrowing = circles.some((c) => c.growing);
    if (!anyGrowing && circles.length > 0) {
      p.noLoop();
    }
  }

  function growCircles() {
    const maxY = p.height - 40;
    for (const c of circles) {
      if (!c.growing) continue;
      c.r += 0.5;

      if (
        c.x - c.r < 0 ||
        c.x + c.r > p.width ||
        c.y - c.r < 0 ||
        c.y + c.r > maxY
      ) {
        c.growing = false;
        continue;
      }
      if (c.maxR && c.r >= c.maxR) {
        c.growing = false;
        continue;
      }

      for (const other of circles) {
        if (c === other) continue;
        if (p.dist(c.x, c.y, other.x, other.y) < c.r + other.r + 1) {
          c.growing = false;
          break;
        }
      }
    }
  }

  function overlaps(x, y, r) {
    for (const c of circles) {
      if (p.dist(x, y, c.x, c.y) < r + c.r + 1) return true;
    }
    return false;
  }

  p.mousePressed = () => {
    if (
      p.mouseX < 0 ||
      p.mouseX > p.width ||
      p.mouseY < 0 ||
      p.mouseY > p.height
    )
      return;

    if (mode === 2) {
      if (p.mouseY >= p.height - 40) {
        // バー部分クリック: モード切替
        mode = 0;
        resetSketch();
        p.loop();
        return;
      }
      // キャンバス部分クリック: 円を追加
      if (!overlaps(p.mouseX, p.mouseY, 2)) {
        circles.push({
          x: p.mouseX,
          y: p.mouseY,
          r: 2,
          growing: true,
          hue: p.random(360),
        });
        p.loop();
      }
      return;
    }

    mode = (mode + 1) % 3;
    resetSketch();
    p.loop();
  };
}
