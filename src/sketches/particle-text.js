/** パーティクルテキスト — テキストをピクセル解析し、文字の形に粒子を配置 */
export default function (p) {
  const particles = [];
  let scattered = true;
  const TEXT = "p5.js";
  const PARTICLE_SIZE = 4;
  const SAMPLE_STEP = 4; // ピクセルサンプリング間隔

  class Particle {
    constructor(targetX, targetY, hue) {
      this.target = p.createVector(targetX, targetY);
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p.createVector(0, 0);
      this.hue = hue;
      this.size = p.random(PARTICLE_SIZE * 0.6, PARTICLE_SIZE * 1.4);
    }

    update() {
      let target;
      if (scattered) {
        // 散らばり状態: ランダムな場所に向かう（ゆるく）
        if (!this.randomTarget) {
          this.randomTarget = p.createVector(
            p.random(p.width),
            p.random(p.height)
          );
        }
        target = this.randomTarget;
      } else {
        target = this.target;
        this.randomTarget = null;
      }

      // イージング
      const force = target.copy().sub(this.pos);
      const easing = scattered ? 0.02 : 0.06;
      const damping = scattered ? 0.85 : 0.65;
      force.mult(easing);
      this.vel.add(force);
      this.vel.mult(damping);
      this.pos.add(this.vel);
    }

    draw() {
      const speed = this.vel.mag();
      const alpha = p.map(speed, 0, 5, 90, 50);
      p.noStroke();
      p.fill(this.hue, 70, 90, alpha);
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    // オフスクリーンでテキストを描画し、ピクセルを解析
    const pg = p.createGraphics(p.width, p.height);
    pg.pixelDensity(1);
    pg.background(0);
    pg.fill(255);
    pg.noStroke();
    pg.textSize(80);
    pg.textAlign(p.CENTER, p.CENTER);
    pg.textStyle(p.BOLD);
    pg.text(TEXT, pg.width / 2, pg.height / 2);
    pg.loadPixels();

    // 白いピクセルの座標から粒子を生成
    for (let y = 0; y < pg.height; y += SAMPLE_STEP) {
      for (let x = 0; x < pg.width; x += SAMPLE_STEP) {
        const i = (y * pg.width + x) * 4;
        const brightness = pg.pixels[i]; // R チャネルで判定
        if (brightness > 128) {
          const hue = p.map(x, 0, pg.width, 0, 300);
          particles.push(new Particle(x, y, hue));
        }
      }
    }

    pg.remove();
  };

  p.draw = () => {
    p.background(0, 0, 12);

    for (const particle of particles) {
      particle.update();
      particle.draw();
    }

    // ガイド
    p.noStroke();
    p.fill(0, 0, 55, 50);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.textStyle(p.NORMAL);
    if (scattered) {
      p.text("クリックで集合", p.width / 2, p.height - 14);
    } else {
      p.text("クリックで散らばり", p.width / 2, p.height - 14);
    }
  };

  p.mousePressed = () => {
    if (
      p.mouseX < 0 ||
      p.mouseX > p.width ||
      p.mouseY < 0 ||
      p.mouseY > p.height
    )
      return;

    scattered = !scattered;

    // 散らばり時は新しいランダム目標を設定
    if (scattered) {
      for (const particle of particles) {
        particle.randomTarget = p.createVector(
          p.random(p.width),
          p.random(p.height)
        );
      }
    }
  };
}
