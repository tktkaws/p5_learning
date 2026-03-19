/** ドラッグ＆ドロップ — 当たり判定とドラッグ状態管理の基本 */
export default function (p) {
  const circles = [];
  const COUNT = 6;
  let dragged = null;
  let offsetX = 0;
  let offsetY = 0;

  class DraggableCircle {
    constructor(x, y, r, hue) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.hue = hue;
    }

    contains(mx, my) {
      return p.dist(mx, my, this.x, this.y) < this.r;
    }

    draw(isDragged) {
      // 影
      if (isDragged) {
        p.noStroke();
        p.fill(0, 0, 0, 30);
        p.circle(this.x + 4, this.y + 4, this.r * 2);
      }

      p.strokeWeight(isDragged ? 3 : 1.5);
      p.stroke(this.hue, 60, 60);
      p.fill(this.hue, 70, 92, 90);
      p.circle(this.x, this.y, this.r * 2);

      // ハイライト
      p.noStroke();
      p.fill(0, 0, 100, 35);
      p.circle(this.x - this.r * 0.25, this.y - this.r * 0.25, this.r * 0.45);
    }
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    for (let i = 0; i < COUNT; i++) {
      const r = p.random(25, 45);
      const x = p.random(r + 10, p.width - r - 10);
      const y = p.random(r + 10, p.height - r - 10);
      const hue = p.map(i, 0, COUNT, 0, 330);
      circles.push(new DraggableCircle(x, y, r, hue));
    }
  };

  p.draw = () => {
    p.background(220, 8, 97);

    for (const c of circles) {
      c.draw(c === dragged);
    }

    // ガイド
    p.noStroke();
    p.fill(0, 0, 50, 50);
    p.textSize(11);
    p.textAlign(p.CENTER);
    if (!dragged) {
      p.text("円をドラッグして移動できます", p.width / 2, p.height - 12);
    } else {
      p.text("ドラッグ中...", p.width / 2, p.height - 12);
    }
  };

  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

    // 配列の後ろ（前面）から順に判定
    for (let i = circles.length - 1; i >= 0; i--) {
      if (circles[i].contains(p.mouseX, p.mouseY)) {
        dragged = circles[i];
        offsetX = dragged.x - p.mouseX;
        offsetY = dragged.y - p.mouseY;

        // Z順序: つかんだ円を最前面（配列末尾）へ移動
        circles.splice(i, 1);
        circles.push(dragged);
        break;
      }
    }
  };

  p.mouseDragged = () => {
    if (!dragged) return;
    dragged.x = p.constrain(p.mouseX + offsetX, dragged.r, p.width - dragged.r);
    dragged.y = p.constrain(p.mouseY + offsetY, dragged.r, p.height - dragged.r);
  };

  p.mouseReleased = () => {
    dragged = null;
  };
}
