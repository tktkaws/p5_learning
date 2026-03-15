/** 重力多体問題 — N体の万有引力シミュレーション */
export default function (p) {
  const bodies = [];
  const G = 0.8;
  const SOFTENING = 5;
  const TRAIL_LEN = 120;

  class Body {
    constructor(x, y, mass, vx, vy) {
      this.x = x;
      this.y = y;
      this.mass = mass;
      this.vx = vx;
      this.vy = vy;
      this.hue = p.random(360);
      this.trail = [];
    }

    applyForce(fx, fy) {
      this.vx += fx / this.mass;
      this.vy += fy / this.mass;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > TRAIL_LEN) {
        this.trail.shift();
      }
    }

    drawTrail() {
      p.noFill();
      p.strokeWeight(1.5);
      p.beginShape();
      for (let i = 0; i < this.trail.length; i++) {
        const alpha = p.map(i, 0, this.trail.length, 0, 50);
        p.stroke(this.hue, 60, 85, alpha);
        p.vertex(this.trail[i].x, this.trail[i].y);
      }
      p.endShape();
    }

    draw() {
      const r = p.map(this.mass, 5, 40, 6, 20);
      p.noStroke();
      // グロー
      p.fill(this.hue, 50, 90, 15);
      p.circle(this.x, this.y, r * 3);
      // 本体
      p.fill(this.hue, 70, 90);
      p.circle(this.x, this.y, r * 2);
      // ハイライト
      p.fill(0, 0, 100, 50);
      p.circle(this.x - r * 0.2, this.y - r * 0.2, r * 0.5);
    }
  }

  function computeGravity() {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy + SOFTENING * SOFTENING;
        const dist = p.sqrt(distSq);
        const force = (G * a.mass * b.mass) / distSq;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        a.applyForce(fx, fy);
        b.applyForce(-fx, -fy);
      }
    }
  }

  function initBodies() {
    bodies.length = 0;
    const cx = p.width / 2;
    const cy = p.height / 2;

    // 中心の重い天体
    bodies.push(new Body(cx, cy, 40, 0, 0));

    // 周囲を回る天体
    const count = 4;
    for (let i = 0; i < count; i++) {
      const angle = (p.TWO_PI / count) * i + p.random(-0.3, 0.3);
      const dist = p.random(80, 140);
      const x = cx + p.cos(angle) * dist;
      const y = cy + p.sin(angle) * dist;
      const mass = p.random(5, 15);

      // 円軌道に近い初速度（接線方向）
      const orbitalSpeed = p.sqrt((G * 40) / dist) * p.random(0.8, 1.2);
      const vx = -p.sin(angle) * orbitalSpeed;
      const vy = p.cos(angle) * orbitalSpeed;

      bodies.push(new Body(x, y, mass, vx, vy));
    }
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    initBodies();
  };

  p.draw = () => {
    p.background(230, 30, 12, 100);

    computeGravity();

    for (const b of bodies) {
      b.update();
    }

    // 軌跡を先に描画
    for (const b of bodies) {
      b.drawTrail();
    }
    // 天体を上に描画
    for (const b of bodies) {
      b.draw();
    }

    // 情報表示
    p.noStroke();
    p.fill(0, 0, 70, 60);
    p.textSize(11);
    p.textAlign(p.LEFT);
    p.text(`天体: ${bodies.length}`, 10, 20);

    p.textAlign(p.CENTER);
    p.text("クリックで天体追加 / ダブルクリックでリセット", p.width / 2, p.height - 12);
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      const mass = p.random(5, 15);
      const vx = p.random(-1, 1);
      const vy = p.random(-1, 1);
      bodies.push(new Body(p.mouseX, p.mouseY, mass, vx, vy));
    }
  };

  p.doubleClicked = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      initBodies();
    }
  };
}
