/** noise() で色相をゆらす有機的グラデーションアニメーション */
export default function (p) {
  let t = 0;
  const noiseScale = 0.008;
  const timeSpeed = 0.005;

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100);
    p.noStroke();
  };

  p.draw = () => {
    const step = 4; // ピクセルステップ（パフォーマンス調整）

    for (let x = 0; x < p.width; x += step) {
      for (let y = 0; y < p.height; y += step) {
        // noise で色相を決定（0〜360）
        const hue =
          p.noise(x * noiseScale, y * noiseScale, t) * 360;

        // 2 つ目の noise レイヤーで彩度に微妙な変化
        const sat =
          60 + p.noise(x * noiseScale * 0.5 + 100, y * noiseScale * 0.5, t * 0.7) * 40;

        // 明度も少しだけゆらす
        const bri =
          70 + p.noise(x * noiseScale * 0.3 + 200, y * noiseScale * 0.3, t * 0.5) * 25;

        p.fill(hue, sat, bri);
        p.rect(x, y, step, step);
      }
    }

    t += timeSpeed;
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      // クリックで時間をジャンプ → 新しいパターンに切替
      t += 10;
    }
  };
};
