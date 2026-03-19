/** レイマーチング2D — 距離関数でオブジェクトの境界を描画。シャドウやグロー等のSDF表現 */
export default function (p) {
  let pg;
  const RES = 200;

  // ---- SDF プリミティブ ----

  function sdCircle(px, py, cx, cy, r) {
    const dx = px - cx;
    const dy = py - cy;
    return Math.sqrt(dx * dx + dy * dy) - r;
  }

  function sdBox(px, py, cx, cy, hw, hh) {
    const dx = Math.abs(px - cx) - hw;
    const dy = Math.abs(py - cy) - hh;
    return (
      Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) +
      Math.min(Math.max(dx, dy), 0)
    );
  }

  // ---- CSG 演算 ----

  function opUnion(a, b) {
    return Math.min(a, b);
  }

  function opSubtract(a, b) {
    return Math.max(a, -b);
  }

  function opSmoothUnion(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
  }

  // ---- シーン定義 ----

  function scene(x, y, t) {
    // メインボディ: 円と矩形の smooth union
    const c1 = sdCircle(x, y, 68, 100, 30);
    const b1 = sdBox(x, y, 132, 100, 22, 28);
    let d = opSmoothUnion(c1, b1, 18);

    // アニメーションする穴 (subtraction)
    const hx = 100 + Math.cos(t * 0.7) * 20;
    const hy = 100 + Math.sin(t * 0.7) * 20;
    d = opSubtract(d, sdCircle(x, y, hx, hy, 14));

    // 浮遊する小さな円
    const c2y = 40 + Math.sin(t * 0.5) * 8;
    d = opUnion(d, sdCircle(x, y, 100, c2y, 13));

    // 左下の小さな矩形
    d = opUnion(d, sdBox(x, y, 52, 162, 16, 10));

    return d;
  }

  // ---- 法線推定（中心差分） ----

  function getNormal(x, y, t) {
    const e = 0.5;
    const nx = scene(x + e, y, t) - scene(x - e, y, t);
    const ny = scene(x, y + e, t) - scene(x, y - e, t);
    const len = Math.sqrt(nx * nx + ny * ny) || 1;
    return [nx / len, ny / len];
  }

  // ---- ソフトシャドウ ----

  function softShadow(ox, oy, lx, ly, k, t, maxSteps) {
    let dx = lx - ox;
    let dy = ly - oy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return 1;
    dx /= dist;
    dy /= dist;

    let res = 1;
    let s = 2;
    for (let i = 0; i < maxSteps && s < dist; i++) {
      const d = scene(ox + dx * s, oy + dy * s, t);
      if (d < 0.5) return 0;
      res = Math.min(res, k * d / s);
      s += Math.max(d, 1);
    }
    return Math.max(res, 0);
  }

  p.setup = () => {
    p.createCanvas(400, 400);
    pg = p.createGraphics(RES, RES);
    pg.pixelDensity(1);
  };

  p.draw = () => {
    const t = p.millis() / 1000;

    // マウス位置 → ライト位置（RES空間にスケール）
    const inCanvas =
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height;
    const lx = inCanvas ? p.mouseX / 2 : RES / 2;
    const ly = inCanvas ? p.mouseY / 2 : RES * 0.3;

    pg.loadPixels();
    const pixels = pg.pixels;

    for (let y = 0; y < RES; y++) {
      for (let x = 0; x < RES; x++) {
        const d = scene(x, y, t);
        let r, g, b;

        if (d < 0) {
          // ---- オブジェクト内部: ライティング ----
          const [nx, ny] = getNormal(x, y, t);

          // ライト方向
          let ldx = lx - x;
          let ldy = ly - y;
          const ll = Math.sqrt(ldx * ldx + ldy * ldy) || 1;
          ldx /= ll;
          ldy /= ll;

          // 拡散反射
          const diff = Math.max(nx * ldx + ny * ldy, 0);

          // ソフトシャドウ（表面からオフセットして計算）
          const sh = softShadow(
            x + nx * 2,
            y + ny * 2,
            lx,
            ly,
            8,
            t,
            48
          );

          const I = 0.15 + 0.85 * diff * sh;
          r = Math.floor(50 + 105 * I);
          g = Math.floor(85 + 145 * I);
          b = Math.floor(150 + 105 * I);
        } else {
          // ---- オブジェクト外部: グロー + 等高線 ----

          // グロー（距離に応じた指数減衰）
          const glow = Math.exp(-d * 0.07);

          // 等高線（cos で距離フィールドを可視化）
          const spacing = 8;
          const contour =
            (0.5 + 0.5 * Math.cos((d / spacing) * Math.PI * 2)) *
            Math.exp(-d * 0.02);

          // 近距離のみシャドウ計算（パフォーマンス対策）
          let sh = 1;
          if (d < 40) {
            sh = softShadow(x, y, lx, ly, 6, t, 32);
          }

          const base = 0.03 + 0.05 * sh;
          r = Math.floor(255 * Math.min(base + glow * 0.12 + contour * 0.06, 1));
          g = Math.floor(255 * Math.min(base + glow * 0.28 + contour * 0.12, 1));
          b = Math.floor(255 * Math.min(base + glow * 0.55 + contour * 0.20, 1));
        }

        const idx = (y * RES + x) * 4;
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
        pixels[idx + 3] = 255;
      }
    }

    pg.updatePixels();
    p.image(pg, 0, 0, 400, 400);

    // ガイドテキスト
    p.noStroke();
    p.fill(255, 120);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("マウスで光源を移動", p.width / 2, p.height - 14);
  };
}
