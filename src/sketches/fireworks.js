/** 花火パーティクル — クリックで打ち上がる花火 */
export default function (p) {
  const fireworks = [];
  const gravity = 0.08;

  class Particle {
    constructor(x, y, hue, isShell) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.isShell = isShell;
      this.alpha = 100;

      if (isShell) {
        this.vx = p.random(-0.5, 0.5);
        this.vy = p.random(-10, -7);
        this.size = 4;
      } else {
        const angle = p.random(p.TWO_PI);
        const speed = p.random(1, 5);
        this.vx = p.cos(angle) * speed;
        this.vy = p.sin(angle) * speed;
        this.size = p.random(2, 4);
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += gravity;

      if (!this.isShell) {
        this.alpha -= 1.5;
        this.vx *= 0.98;
        this.vy *= 0.98;
      }
    }

    isDead() {
      return this.alpha <= 0;
    }

    draw() {
      p.noStroke();
      p.fill(this.hue, 80, 100, this.alpha);
      p.circle(this.x, this.y, this.size);
    }
  }

  class Firework {
    constructor(x) {
      this.hue = p.random(360);
      this.shell = new Particle(x, p.height, this.hue, true);
      this.sparks = [];
      this.exploded = false;
    }

    update() {
      if (!this.exploded) {
        this.shell.update();
        if (this.shell.vy >= 0) this.explode();
      }

      for (let i = this.sparks.length - 1; i >= 0; i--) {
        this.sparks[i].update();
        if (this.sparks[i].isDead()) this.sparks.splice(i, 1);
      }
    }

    explode() {
      this.exploded = true;
      const count = p.floor(p.random(30, 60));
      for (let i = 0; i < count; i++) {
        this.sparks.push(
          new Particle(this.shell.x, this.shell.y, this.hue, false)
        );
      }
    }

    isDead() {
      return this.exploded && this.sparks.length === 0;
    }

    draw() {
      if (!this.exploded) this.shell.draw();
      for (const spark of this.sparks) spark.draw();
    }
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);
  };

  p.draw = () => {
    p.background(0, 0, 10, 30);

    // 自動打ち上げ（低頻度）
    if (p.random() < 0.02) {
      fireworks.push(new Firework(p.random(50, p.width - 50)));
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].isDead()) fireworks.splice(i, 1);
    }

    // ガイド
    p.noStroke();
    p.fill(0, 0, 50, 60);
    p.textSize(12);
    p.textAlign(p.CENTER);
    p.text("クリックで花火を打ち上げ", p.width / 2, p.height - 15);
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      fireworks.push(new Firework(p.mouseX));
    }
  };
}
