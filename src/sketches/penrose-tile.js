/** ペンローズタイル — 非周期的タイル貼り */
export default function (p) {
  let mode = 0;
  const labels = ["カイト＆ダート", "太い菱形＆細い菱形", "色付きパターン"];
  const PHI = (1 + Math.sqrt(5)) / 2;
  let triangles = [];

  p.setup = () => {
    p.createCanvas(400, 400);
    p.noLoop();
    generateTiling();
  };

  function generateTiling() {
    let tris = [];
    const cx = p.width / 2;
    const cy = (p.height - 40) / 2;
    const r = 260;

    for (let i = 0; i < 10; i++) {
      const a1 = (p.TWO_PI / 10) * i;
      const a2 = (p.TWO_PI / 10) * (i + 1);
      const A = [cx, cy];
      const B = [cx + p.cos(a1) * r, cy + p.sin(a1) * r];
      const C = [cx + p.cos(a2) * r, cy + p.sin(a2) * r];

      if (i % 2 === 0) {
        tris.push([0, A, B, C]);
      } else {
        tris.push([0, A, C, B]);
      }
    }

    for (let i = 0; i < 5; i++) {
      tris = subdivide(tris);
    }

    triangles = tris;
  }

  function subdivide(tris) {
    const result = [];
    for (const [type, A, B, C] of tris) {
      if (type === 0) {
        const P = lerpPt(A, B, 1 / PHI);
        result.push([0, C, P, B]);
        result.push([1, P, C, A]);
      } else {
        const Q = lerpPt(B, A, 1 / PHI);
        const R = lerpPt(B, C, 1 / PHI);
        result.push([1, R, C, A]);
        result.push([1, Q, R, B]);
        result.push([0, R, Q, A]);
      }
    }
    return result;
  }

  function lerpPt(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

  p.draw = () => {
    p.background(245);

    if (mode === 2) {
      p.colorMode(p.HSB, 360, 100, 100);
    }

    for (const [type, A, B, C] of triangles) {
      if (mode === 0) {
        p.fill(type === 0 ? p.color(70, 130, 180) : p.color(230, 140, 60));
        p.stroke(40);
      } else if (mode === 1) {
        p.fill(
          type === 0 ? p.color(140, 190, 140) : p.color(190, 150, 200)
        );
        p.stroke(80);
      } else {
        const tcx = (A[0] + B[0] + C[0]) / 3;
        const tcy = (A[1] + B[1] + C[1]) / 3;
        const hue =
          (p.map(tcx + tcy, 0, p.width + p.height, 0, 360) + type * 40) %
          360;
        p.fill(hue, 50, 92);
        p.stroke(hue, 55, 75);
      }
      p.strokeWeight(0.5);
      p.triangle(A[0], A[1], B[0], B[1], C[0], C[1]);
    }

    if (mode === 2) {
      p.colorMode(p.RGB, 255);
    }

    // --- モード表示 ---
    p.noStroke();
    p.fill(245, 245, 245, 220);
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(80);
    p.textSize(13);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(labels[mode] + "（クリックで切替）", p.width / 2, p.height - 20);
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      mode = (mode + 1) % 3;
      p.redraw();
    }
  };
}
