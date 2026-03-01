/** テキストとフォント — タイピング風アニメーション */
export default function (p) {
  const message = "Hello, p5.js!";
  let charIndex = 0;
  let lastTime = 0;
  const typeSpeed = 120; // ms per character

  p.setup = () => {
    p.createCanvas(400, 400);
    p.textFont("monospace");
  };

  p.draw = () => {
    p.background(240);

    // --- タイピングアニメーション ---
    if (p.millis() - lastTime > typeSpeed && charIndex < message.length) {
      charIndex++;
      lastTime = p.millis();
    }

    const displayed = message.substring(0, charIndex);

    // カーソル点滅
    const showCursor = p.floor(p.millis() / 500) % 2 === 0;
    const cursorChar = showCursor ? "|" : "";

    p.noStroke();
    p.fill(30);
    p.textSize(28);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(displayed + cursorChar, 200, 60);

    // --- textSize のデモ ---
    p.fill(80);
    p.textSize(11);
    p.textAlign(p.LEFT);
    p.text("textSize の比較:", 20, 120);

    const sizes = [10, 14, 20, 28, 36];
    let yPos = 140;
    for (const size of sizes) {
      p.textSize(size);
      p.fill(99, 102, 241);
      p.text(`${size}px`, 20, yPos);
      p.fill(60);
      p.text("  あいうえお ABC", 70, yPos);
      yPos += size + 10;
    }

    // --- textAlign のデモ ---
    const alignY = 320;
    p.stroke(220);
    p.strokeWeight(1);
    p.line(200, alignY - 10, 200, alignY + 50);

    p.noStroke();
    p.textSize(13);

    p.fill(99, 102, 241);
    p.textAlign(p.LEFT);
    p.text("LEFT", 200, alignY);

    p.fill(236, 72, 153);
    p.textAlign(p.CENTER);
    p.text("CENTER", 200, alignY + 18);

    p.fill(16, 185, 129);
    p.textAlign(p.RIGHT);
    p.text("RIGHT", 200, alignY + 36);

    // ガイド
    p.fill(160);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("クリックでタイピングをリセット", 200, 390);
  };

  p.mousePressed = () => {
    charIndex = 0;
    lastTime = p.millis();
  };
}
