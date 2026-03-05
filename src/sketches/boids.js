/** 群れシミュレーション（Boids） — 分離・整列・結合の3ルールで群れ行動を再現 */
export default function (p) {
  const boids = [];
  const NUM = 80;

  class Boid {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = p.random(p.TWO_PI);
      const speed = p.random(1, 3);
      this.vx = p.cos(angle) * speed;
      this.vy = p.sin(angle) * speed;
      this.maxSpeed = 3;
      this.maxForce = 0.05;
      this.hue = p.random(180, 240);
    }

    edges() {
      if (this.x > p.width) this.x = 0;
      if (this.x < 0) this.x = p.width;
      if (this.y > p.height) this.y = 0;
      if (this.y < 0) this.y = p.height;
    }

    flock(others) {
      let sepX = 0, sepY = 0, sepCount = 0;
      let aliX = 0, aliY = 0, aliCount = 0;
      let cohX = 0, cohY = 0, cohCount = 0;

      for (const other of others) {
        if (other === this) continue;
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const d = p.sqrt(dx * dx + dy * dy);

        if (d < 25 && d > 0) {
          sepX += dx / (d * d);
          sepY += dy / (d * d);
          sepCount++;
        }
        if (d < 50) {
          aliX += other.vx;
          aliY += other.vy;
          aliCount++;
          cohX += other.x;
          cohY += other.y;
          cohCount++;
        }
      }

      let ax = 0, ay = 0;

      // 分離（Separation）
      if (sepCount > 0) {
        sepX /= sepCount;
        sepY /= sepCount;
        const mag = p.sqrt(sepX * sepX + sepY * sepY);
        if (mag > 0) {
          let sx = (sepX / mag) * this.maxSpeed - this.vx;
          let sy = (sepY / mag) * this.maxSpeed - this.vy;
          const sm = p.sqrt(sx * sx + sy * sy);
          if (sm > this.maxForce) {
            sx = (sx / sm) * this.maxForce;
            sy = (sy / sm) * this.maxForce;
          }
          ax += sx * 1.5;
          ay += sy * 1.5;
        }
      }

      // 整列（Alignment）
      if (aliCount > 0) {
        aliX /= aliCount;
        aliY /= aliCount;
        const mag = p.sqrt(aliX * aliX + aliY * aliY);
        if (mag > 0) {
          let sx = (aliX / mag) * this.maxSpeed - this.vx;
          let sy = (aliY / mag) * this.maxSpeed - this.vy;
          const sm = p.sqrt(sx * sx + sy * sy);
          if (sm > this.maxForce) {
            sx = (sx / sm) * this.maxForce;
            sy = (sy / sm) * this.maxForce;
          }
          ax += sx;
          ay += sy;
        }
      }

      // 結合（Cohesion）
      if (cohCount > 0) {
        cohX = cohX / cohCount - this.x;
        cohY = cohY / cohCount - this.y;
        const mag = p.sqrt(cohX * cohX + cohY * cohY);
        if (mag > 0) {
          let sx = (cohX / mag) * this.maxSpeed - this.vx;
          let sy = (cohY / mag) * this.maxSpeed - this.vy;
          const sm = p.sqrt(sx * sx + sy * sy);
          if (sm > this.maxForce) {
            sx = (sx / sm) * this.maxForce;
            sy = (sy / sm) * this.maxForce;
          }
          ax += sx;
          ay += sy;
        }
      }

      this.vx += ax;
      this.vy += ay;
    }

    update() {
      const speed = p.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > this.maxSpeed) {
        this.vx = (this.vx / speed) * this.maxSpeed;
        this.vy = (this.vy / speed) * this.maxSpeed;
      }
      this.x += this.vx;
      this.y += this.vy;
    }

    draw() {
      const angle = p.atan2(this.vy, this.vx);
      p.push();
      p.translate(this.x, this.y);
      p.rotate(angle);
      p.fill(this.hue, 70, 95, 80);
      p.noStroke();
      p.triangle(8, 0, -5, -3.5, -5, 3.5);
      p.pop();
    }
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    for (let i = 0; i < NUM; i++) {
      boids.push(new Boid(p.random(p.width), p.random(p.height)));
    }
  };

  p.draw = () => {
    p.background(220, 30, 15);

    for (const b of boids) {
      b.flock(boids);
      b.update();
      b.edges();
      b.draw();
    }

    // ガイド
    p.noStroke();
    p.fill(0, 0, 100, 40);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("クリックで鳥を追加", p.width / 2, p.height - 12);
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      boids.push(new Boid(p.mouseX, p.mouseY));
    }
  };
}
