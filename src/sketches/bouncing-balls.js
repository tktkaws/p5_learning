/** 衝突する球 — 弾性衝突と運動量保存のシミュレーション */
export default function (p) {
  const balls = [];
  const INITIAL_COUNT = 6;

  class Ball {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.mass = r * r;
      const angle = p.random(p.TWO_PI);
      const speed = p.random(1, 3);
      this.vx = p.cos(angle) * speed;
      this.vy = p.sin(angle) * speed;
      this.hue = p.random(360);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
    }

    wallCollision() {
      if (this.x - this.r < 0) {
        this.x = this.r;
        this.vx *= -1;
      }
      if (this.x + this.r > p.width) {
        this.x = p.width - this.r;
        this.vx *= -1;
      }
      if (this.y - this.r < 0) {
        this.y = this.r;
        this.vy *= -1;
      }
      if (this.y + this.r > p.height) {
        this.y = p.height - this.r;
        this.vy *= -1;
      }
    }

    draw() {
      p.fill(this.hue, 75, 90, 85);
      p.stroke(this.hue, 60, 70);
      p.strokeWeight(1.5);
      p.circle(this.x, this.y, this.r * 2);

      // ハイライト
      p.noStroke();
      p.fill(0, 0, 100, 40);
      p.circle(this.x - this.r * 0.25, this.y - this.r * 0.25, this.r * 0.5);
    }
  }

  function resolveCollision(b1, b2) {
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const dist = p.sqrt(dx * dx + dy * dy);
    const minDist = b1.r + b2.r;

    if (dist >= minDist || dist === 0) return;

    // 法線ベクトル
    const nx = dx / dist;
    const ny = dy / dist;

    // めり込み解消
    const overlap = minDist - dist;
    const totalMass = b1.mass + b2.mass;
    b1.x -= (nx * overlap * b2.mass) / totalMass;
    b1.y -= (ny * overlap * b2.mass) / totalMass;
    b2.x += (nx * overlap * b1.mass) / totalMass;
    b2.y += (ny * overlap * b1.mass) / totalMass;

    // 法線方向の相対速度
    const dvx = b1.vx - b2.vx;
    const dvy = b1.vy - b2.vy;
    const dvn = dvx * nx + dvy * ny;

    // 離れていく方向なら衝突処理しない
    if (dvn < 0) return;

    // 弾性衝突のインパルス
    const impulse = (2 * dvn) / totalMass;

    b1.vx -= impulse * b2.mass * nx;
    b1.vy -= impulse * b2.mass * ny;
    b2.vx += impulse * b1.mass * nx;
    b2.vy += impulse * b1.mass * ny;
  }

  function addBall(x, y) {
    const r = p.random(12, 30);
    // 重なりチェック
    for (const b of balls) {
      const d = p.dist(x, y, b.x, b.y);
      if (d < r + b.r + 2) return;
    }
    balls.push(new Ball(x, y, r));
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    for (let i = 0; i < INITIAL_COUNT; i++) {
      const r = p.random(15, 30);
      const x = p.random(r + 10, p.width - r - 10);
      const y = p.random(r + 10, p.height - r - 10);
      balls.push(new Ball(x, y, r));
    }
  };

  p.draw = () => {
    p.background(220, 10, 97);

    // 衝突判定
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        resolveCollision(balls[i], balls[j]);
      }
    }

    // 更新と描画
    for (const b of balls) {
      b.update();
      b.wallCollision();
      b.draw();
    }

    // 球の数
    p.noStroke();
    p.fill(0, 0, 50, 60);
    p.textSize(11);
    p.textAlign(p.LEFT);
    p.text(`球: ${balls.length}`, 10, 20);

    // ガイド
    p.textAlign(p.CENTER);
    p.text("クリックで球を追加", p.width / 2, p.height - 12);
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      addBall(p.mouseX, p.mouseY);
    }
  };
}
