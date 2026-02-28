/** マウスインタラクション — カーソルに追従する円 */
export default function (p) {
  const trail = [];
  const maxTrail = 30;

  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(240);

    // マウス位置を軌跡に追加
    trail.push({ x: p.mouseX, y: p.mouseY });
    if (trail.length > maxTrail) trail.shift();

    // 軌跡を描画（古いほど小さく薄く）
    for (let i = 0; i < trail.length; i++) {
      const t = i / trail.length;
      const size = t * 40 + 5;
      const alpha = t * 200 + 30;

      p.noStroke();
      p.fill(99, 102, 241, alpha);
      p.circle(trail[i].x, trail[i].y, size);
    }

    // ガイドテキスト
    p.noStroke();
    p.fill(180);
    p.textSize(13);
    p.textAlign(p.CENTER);
    p.text("マウスを動かしてみてください", 200, 380);
  };
}
