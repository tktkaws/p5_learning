/** アニメーション入門 — 跳ね返るボール */
export default function (p) {
  let x, y, vx, vy, size;

  p.setup = () => {
    p.createCanvas(400, 400);
    x = 200;
    y = 200;
    vx = 3;
    vy = 2;
    size = 40;
  };

  p.draw = () => {
    p.background(30, 30, 50, 40);

    // 位置の更新
    x += vx;
    y += vy;

    // 壁で跳ね返る
    if (x - size / 2 < 0 || x + size / 2 > p.width) vx *= -1;
    if (y - size / 2 < 0 || y + size / 2 > p.height) vy *= -1;

    // ボールの描画
    p.noStroke();
    p.fill(255, 105, 135);
    p.circle(x, y, size);

    // 軌跡が残るように半透明の背景を使っている
  };
}
