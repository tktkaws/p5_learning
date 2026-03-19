/** スライダーで制御 — createSlider() で図形ジェネレーターのパラメータをリアルタイム操作 */
export default function (p) {
  let sliderCount, sliderSize, sliderHue, sliderSpeed;
  let angle = 0;

  function makeSlider(label, min, max, value, step) {
    const wrap = p.createDiv();
    wrap.style("display", "flex");
    wrap.style("align-items", "center");
    wrap.style("gap", "0.5rem");
    wrap.style("font-size", "13px");
    wrap.style("color", "#555");
    wrap.style("font-family", "'Inter', 'Noto Sans JP', sans-serif");

    const lbl = p.createSpan(label);
    lbl.parent(wrap);
    lbl.style("min-width", "80px");
    lbl.style("text-align", "right");

    const slider = p.createSlider(min, max, value, step);
    slider.parent(wrap);
    slider.style("flex", "1");

    const val = p.createSpan(String(value));
    val.parent(wrap);
    val.style("min-width", "32px");
    val.style("font-variant-numeric", "tabular-nums");

    slider.input(() => val.html(String(slider.value())));

    return { wrap, slider };
  }

  p.setup = () => {
    const canvas = p.createCanvas(400, 400);

    // スライダーコンテナ
    const controls = p.createDiv();
    controls.style("display", "flex");
    controls.style("flex-direction", "column");
    controls.style("gap", "0.4rem");
    controls.style("margin-top", "0.75rem");
    controls.style("max-width", "400px");

    const s1 = makeSlider("図形の数", 3, 20, 8, 1);
    s1.wrap.parent(controls);
    sliderCount = s1.slider;

    const s2 = makeSlider("サイズ", 10, 100, 40, 1);
    s2.wrap.parent(controls);
    sliderSize = s2.slider;

    const s3 = makeSlider("色相", 0, 360, 200, 1);
    s3.wrap.parent(controls);
    sliderHue = s3.slider;

    const s4 = makeSlider("回転速度", 0, 100, 30, 1);
    s4.wrap.parent(controls);
    sliderSpeed = s4.slider;

    p.colorMode(p.HSB, 360, 100, 100, 100);
  };

  p.draw = () => {
    p.background(0, 0, 97);

    const count = sliderCount.value();
    const size = sliderSize.value();
    const hue = sliderHue.value();
    const speed = p.map(sliderSpeed.value(), 0, 100, 0, 0.05);

    angle += speed;

    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(angle);

    const radius = 120;

    for (let i = 0; i < count; i++) {
      const a = p.map(i, 0, count, 0, p.TWO_PI);
      const x = p.cos(a) * radius;
      const y = p.sin(a) * radius;

      const h = (hue + i * (360 / count)) % 360;

      p.push();
      p.translate(x, y);
      p.rotate(a + angle * 2);

      // 図形本体
      p.strokeWeight(1.5);
      p.stroke(h, 60, 50);
      p.fill(h, 65, 90, 80);

      // 角数に応じた正多角形
      const sides = 3 + (i % 4); // 三角〜六角形
      p.beginShape();
      for (let s = 0; s < sides; s++) {
        const sa = p.map(s, 0, sides, 0, p.TWO_PI) - p.HALF_PI;
        p.vertex(p.cos(sa) * size / 2, p.sin(sa) * size / 2);
      }
      p.endShape(p.CLOSE);

      p.pop();
    }

    // 中心の装飾
    p.noStroke();
    p.fill(hue, 40, 95, 60);
    p.circle(0, 0, size * 0.6);
    p.fill(hue, 20, 100, 40);
    p.circle(0, 0, size * 0.3);

    p.pop();

    // 接続線
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(angle);
    p.strokeWeight(0.5);
    p.stroke(hue, 30, 70, 30);
    for (let i = 0; i < count; i++) {
      const a1 = p.map(i, 0, count, 0, p.TWO_PI);
      const a2 = p.map((i + 1) % count, 0, count, 0, p.TWO_PI);
      const x1 = p.cos(a1) * radius;
      const y1 = p.sin(a1) * radius;
      const x2 = p.cos(a2) * radius;
      const y2 = p.sin(a2) * radius;
      p.line(x1, y1, x2, y2);
    }
    p.pop();
  };
}
