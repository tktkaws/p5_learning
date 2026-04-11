// 音声ビジュアライザ — Web Audio API で FFT 解析し、スペクトラムバーをリアルタイム描画
export default function (p) {
  const W = 400;
  const H = 400;

  let audioCtx;
  let analyser;
  let dataArray;
  let started = false;

  p.setup = () => {
    p.createCanvas(W, H);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
  };

  p.draw = () => {
    p.background(20);

    if (!started) {
      drawStartPrompt();
      return;
    }

    analyser.getByteFrequencyData(dataArray);

    // バーの本数（低〜中周波数域を中心に表示）
    const barCount = 64;
    const barW = W / barCount;
    const binStep = Math.floor(dataArray.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * binStep];
      const barH = p.map(value, 0, 255, 2, H * 0.85);

      // HSB でバーの色を周波数に応じて変化
      const hue = p.map(i, 0, barCount, 200, 360);
      p.colorMode(p.HSB, 360, 100, 100);
      const brightness = p.map(value, 0, 255, 30, 100);
      p.fill(hue % 360, 80, brightness);

      // 下揃えで描画
      const x = i * barW;
      const y = H - barH;
      p.rect(x, y, barW - 1, barH, 2, 2, 0, 0);
    }

    // ラベル
    p.colorMode(p.RGB);
    p.fill(255, 180);
    p.textSize(11);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Low", 8, H - 4);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text("High", W - 8, H - 4);
    p.textAlign(p.CENTER, p.CENTER);
  };

  function drawStartPrompt() {
    p.fill(255, 200);
    p.textSize(16);
    p.text("クリックしてマイクを起動", W / 2, H / 2);
    p.textSize(12);
    p.fill(255, 120);
    p.text("ブラウザがマイクの許可を求めます", W / 2, H / 2 + 28);
  }

  async function startAudio() {
    if (started) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new AudioContext();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      dataArray = new Uint8Array(analyser.frequencyBinCount);
      started = true;
    } catch (e) {
      console.error("マイクへのアクセスが拒否されました:", e);
    }
  }

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= W &&
      p.mouseY >= 0 &&
      p.mouseY <= H
    ) {
      startAudio();
    }
  };
}
