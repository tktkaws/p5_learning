/** キーボードお絵かき — キーで色・ブラシ切替、マウスで描画 */
export default function (p) {
  let brushColor;
  let brushSize = 8;
  let brushType = "circle";
  const colors = [];

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(0, 0, 98);

    // プリセット色
    colors.push(
      { h: 0, s: 80, b: 95, label: "赤 (1)" },
      { h: 30, s: 80, b: 95, label: "橙 (2)" },
      { h: 60, s: 80, b: 95, label: "黄 (3)" },
      { h: 130, s: 70, b: 80, label: "緑 (4)" },
      { h: 220, s: 70, b: 95, label: "青 (5)" },
      { h: 280, s: 60, b: 90, label: "紫 (6)" },
      { h: 0, s: 0, b: 0, label: "黒 (7)" }
    );
    brushColor = colors[6]; // 初期色: 黒
  };

  p.draw = () => {
    // マウスドラッグで描画
    if (p.mouseIsPressed && isInCanvas()) {
      p.noStroke();
      p.fill(brushColor.h, brushColor.s, brushColor.b, 80);

      if (brushType === "circle") {
        p.circle(p.mouseX, p.mouseY, brushSize);
      } else if (brushType === "square") {
        p.rectMode(p.CENTER);
        p.rect(p.mouseX, p.mouseY, brushSize, brushSize);
      } else if (brushType === "spray") {
        for (let i = 0; i < 10; i++) {
          const ox = p.randomGaussian(0, brushSize / 2);
          const oy = p.randomGaussian(0, brushSize / 2);
          p.circle(p.mouseX + ox, p.mouseY + oy, 2);
        }
      }
    }

    drawUI();
  };

  function isInCanvas() {
    return (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    );
  }

  function drawUI() {
    // 下部ツールバー
    p.noStroke();
    p.fill(0, 0, 100, 90);
    p.rect(0, p.height - 40, p.width, 40);

    p.fill(0, 0, 30);
    p.textSize(11);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(
      `ブラシ: ${brushType}  サイズ: ${brushSize}  色: ${brushColor.label}`,
      10,
      p.height - 20
    );

    p.textAlign(p.RIGHT, p.CENTER);
    p.text("C:クリア  ↑↓:サイズ  B:ブラシ切替", p.width - 10, p.height - 20);
  }

  p.keyPressed = () => {
    // 数字キーで色変更
    if (p.key >= "1" && p.key <= "7") {
      brushColor = colors[parseInt(p.key) - 1];
    }

    // ブラシサイズ
    if (p.keyCode === p.UP_ARROW) brushSize = p.min(brushSize + 4, 60);
    if (p.keyCode === p.DOWN_ARROW) brushSize = p.max(brushSize - 4, 2);

    // ブラシ種類切替
    if (p.key === "b" || p.key === "B") {
      const types = ["circle", "square", "spray"];
      const idx = (types.indexOf(brushType) + 1) % types.length;
      brushType = types[idx];
    }

    // クリア
    if (p.key === "c" || p.key === "C") {
      p.background(0, 0, 98);
    }
  };
}
