/** Perlinノイズフロー — noise()で有機的に流れる粒子群 */
export default function (p) {
  const particles = [];
  const numParticles = 500;
  const noiseScale = 0.005;
  let zOffset = 0;

  class FlowParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.prevX = this.x;
      this.prevY = this.y;
      this.speed = p.random(1, 3);
    }

    update() {
      this.prevX = this.x;
      this.prevY = this.y;

      // Perlinノイズで角度を決定
      const angle =
        p.noise(this.x * noiseScale, this.y * noiseScale, zOffset) *
        p.TWO_PI *
        2;

      this.x += p.cos(angle) * this.speed;
      this.y += p.sin(angle) * this.speed;

      // 画面外に出たらリセット
      if (
        this.x < 0 ||
        this.x > p.width ||
        this.y < 0 ||
        this.y > p.height
      ) {
        this.reset();
        this.prevX = this.x;
        this.prevY = this.y;
      }
    }

    draw(hueBase) {
      const hue = (hueBase + this.x * 0.2 + this.y * 0.2) % 360;
      p.stroke(hue, 60, 90, 15);
      p.line(this.prevX, this.prevY, this.x, this.y);
    }
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(0, 0, 10);

    for (let i = 0; i < numParticles; i++) {
      particles.push(new FlowParticle());
    }
  };

  p.draw = () => {
    // 薄くフェード
    p.noStroke();
    p.fill(0, 0, 10, 2);
    p.rect(0, 0, p.width, p.height);

    const hueBase = p.frameCount * 0.3;
    p.strokeWeight(1);

    for (const particle of particles) {
      particle.update();
      particle.draw(hueBase);
    }

    zOffset += 0.001;
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      p.background(0, 0, 10);
      for (const particle of particles) particle.reset();
    }
  };
}
