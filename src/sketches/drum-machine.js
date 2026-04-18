// ドラムマシン — グリッド UI でビートを組み、Web Audio API のオシレータで音を鳴らすステップシーケンサ
export default function (p) {
  const W = 400;
  const H = 400;

  // -- 設定 --
  const TRACKS = 4;
  const STEPS = 16;
  const NAMES = ["Kick", "Snare", "HiHat", "Clap"];
  const COLORS = [
    [255, 90, 70],
    [70, 170, 255],
    [255, 210, 50],
    [190, 120, 255],
  ];

  // -- レイアウト --
  const LABEL_W = 46;
  const GX = LABEL_W + 6;
  const GY = 32;
  const CW = 20;
  const CH = 36;
  const GAP = 1;
  const STRIDE = CW + GAP;

  // -- 状態 --
  const grid = Array.from({ length: TRACKS }, () => Array(STEPS).fill(false));
  let playing = false;
  let currentStep = -1;
  let bpm = 120;
  let lastStepTime = 0;
  const flash = new Float32Array(TRACKS);

  // -- オーディオ --
  let audioCtx = null;
  let noiseBuffer = null;

  // -- DOM --
  let bpmSlider, bpmVal;

  p.setup = () => {
    p.createCanvas(W, H);
    p.textFont("monospace");

    // BPM スライダー（キャンバス下に配置）
    const row = p.createDiv();
    row.style("display", "flex");
    row.style("align-items", "center");
    row.style("gap", "0.5rem");
    row.style("margin-top", "0.5rem");
    row.style("max-width", W + "px");
    row.style("font-size", "13px");
    row.style("color", "#888");
    row.style("font-family", "'Inter','Noto Sans JP',sans-serif");

    p.createSpan("BPM").parent(row);
    bpmSlider = p.createSlider(60, 180, 120, 1);
    bpmSlider.parent(row);
    bpmSlider.style("flex", "1");
    bpmSlider.input(() => {
      bpm = bpmSlider.value();
      bpmVal.html(String(bpm));
    });
    bpmVal = p.createSpan("120");
    bpmVal.parent(row);
    bpmVal.style("min-width", "28px");
    bpmVal.style("font-variant-numeric", "tabular-nums");

    setDefaultPattern();
  };

  function setDefaultPattern() {
    const patterns = [
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], // Kick: 4つ打ち
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Snare: 2, 4拍
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // HiHat: 8分
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Clap: 空
    ];
    for (let t = 0; t < TRACKS; t++)
      for (let s = 0; s < STEPS; s++) grid[t][s] = !!patterns[t][s];
  }

  // ===== オーディオ初期化 =====
  function initAudio() {
    if (audioCtx) {
      if (audioCtx.state === "suspended") audioCtx.resume();
      return;
    }
    audioCtx = new AudioContext();
    // ノイズバッファを事前生成（スネア・ハイハット・クラップ用）
    const len = audioCtx.sampleRate;
    noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  // ===== ドラム音の合成 =====

  // キック: 低周波サイン波 + ピッチエンベロープ
  function playKick() {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // スネア: ノイズ（ハイパス）+ トライアングル波トーン
  function playSnare() {
    const now = audioCtx.currentTime;
    // ノイズ成分
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const hpf = audioCtx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 1000;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(hpf).connect(noiseGain).connect(audioCtx.destination);
    noise.start(now);
    noise.stop(now + 0.15);
    // トーン成分
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 185;
    oscGain.gain.setValueAtTime(0.45, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(oscGain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // ハイハット: 高周波ノイズ + 短いディケイ
  function playHiHat() {
    const now = audioCtx.currentTime;
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const hpf = audioCtx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 6000;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    noise.connect(hpf).connect(gain).connect(audioCtx.destination);
    noise.start(now);
    noise.stop(now + 0.06);
  }

  // クラップ: バンドパスノイズ + 短いディケイ
  function playClap() {
    const now = audioCtx.currentTime;
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const bpf = audioCtx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = 2500;
    bpf.Q.value = 1.2;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.connect(bpf).connect(gain).connect(audioCtx.destination);
    noise.start(now);
    noise.stop(now + 0.12);
  }

  const sounds = [playKick, playSnare, playHiHat, playClap];

  function triggerStep(s) {
    for (let t = 0; t < TRACKS; t++) {
      if (grid[t][s]) {
        sounds[t]();
        flash[t] = 1;
      }
    }
  }

  // ===== 描画 =====
  p.draw = () => {
    p.background(25);

    // シーケンサ進行（16分音符間隔）
    if (playing) {
      const interval = 60000 / bpm / 4;
      const now = p.millis();
      if (now - lastStepTime >= interval) {
        currentStep = (currentStep + 1) % STEPS;
        lastStepTime = now;
        triggerStep(currentStep);
      }
    }

    drawBeatNumbers();
    drawGrid();
    drawPlayhead();
    drawTransport();
    drawVisualization();

    // フラッシュ減衰
    for (let i = 0; i < TRACKS; i++) flash[i] *= 0.88;
  };

  // 拍番号（1〜4）をグリッド上部に表示
  function drawBeatNumbers() {
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.fill(90);
    for (let b = 0; b < 4; b++) {
      const x = GX + (b * 4 + 1.5) * STRIDE + CW / 2;
      p.text(b + 1, x, GY - 4);
    }
  }

  // 4×16 のグリッドセル
  function drawGrid() {
    p.noStroke();
    for (let t = 0; t < TRACKS; t++) {
      const y = GY + t * (CH + GAP);

      // トラック名
      p.fill(COLORS[t][0], COLORS[t][1], COLORS[t][2], 200);
      p.textSize(9);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(NAMES[t], LABEL_W, y + CH / 2);

      for (let s = 0; s < STEPS; s++) {
        const x = GX + s * STRIDE;

        if (grid[t][s]) {
          // アクティブセル（トラック色 + フラッシュ）
          const [cr, cg, cb] = COLORS[t];
          const f = flash[t];
          p.fill(
            cr + (255 - cr) * f * 0.4,
            cg + (255 - cg) * f * 0.4,
            cb + (255 - cb) * f * 0.4
          );
        } else {
          // 非アクティブ（4拍ごとに明暗を分ける）
          p.fill(Math.floor(s / 4) % 2 === 0 ? 48 : 38);
        }
        p.rect(x, y, CW, CH, 3);
      }
    }
  }

  // 再生中のステップをハイライト
  function drawPlayhead() {
    if (!playing || currentStep < 0) return;
    const x = GX + currentStep * STRIDE;
    const gridH = TRACKS * (CH + GAP) - GAP;
    p.noFill();
    p.stroke(255, 160);
    p.strokeWeight(2);
    p.rect(x - 1, GY - 1, CW + 2, gridH + 2, 4);
    p.noStroke();
  }

  // Play/Stop ボタン、Clear ボタン、ステップドット
  function drawTransport() {
    const ty = GY + TRACKS * (CH + GAP) + 12;
    p.noStroke();

    // Play / Stop ボタン
    p.fill(playing ? p.color(240, 70, 70) : p.color(60, 190, 110));
    p.rect(12, ty, 64, 26, 5);
    p.fill(255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(playing ? "■ Stop" : "▶ Play", 44, ty + 13);

    // Clear ボタン
    p.fill(65);
    p.rect(84, ty, 50, 26, 5);
    p.fill(180);
    p.text("Clear", 109, ty + 13);

    // ステップインジケータ（ドット）
    const dotY = ty + 38;
    for (let s = 0; s < STEPS; s++) {
      const cx = GX + s * STRIDE + CW / 2;
      if (playing && s === currentStep) {
        p.fill(255);
      } else if (s % 4 === 0) {
        p.fill(100);
      } else {
        p.fill(50);
      }
      p.circle(cx, dotY, 4);
    }
  }

  // 下部ビジュアライゼーション：各トラックのパルスリング
  function drawVisualization() {
    const visY = 260;
    const visH = 130;

    p.noStroke();
    p.fill(20);
    p.rect(0, visY, W, H - visY);

    // 区切り線
    p.stroke(50);
    p.strokeWeight(1);
    p.line(0, visY, W, visY);
    p.noStroke();

    for (let t = 0; t < TRACKS; t++) {
      const cx = W * (t + 0.5) / TRACKS;
      const cy = visY + visH / 2;
      const [cr, cg, cb] = COLORS[t];
      const f = flash[t];

      // パルスリング（トリガー時に広がるリング）
      if (f > 0.05) {
        const size = 28 + (1 - f) * 24;
        p.noFill();
        p.stroke(cr, cg, cb, f * 150);
        p.strokeWeight(2);
        p.circle(cx, cy, size * 2);
        p.noStroke();
      }

      // 内側の円
      const radius = 20 + f * 12;
      p.fill(cr, cg, cb, 30 + f * 200);
      p.circle(cx, cy, radius * 2);

      // トラック名
      p.fill(255, 40 + f * 200);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(NAMES[t], cx, cy);
    }
  }

  // ===== インタラクション =====
  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > W || p.mouseY < 0 || p.mouseY > H) return;
    initAudio();

    // グリッドセルのトグル
    for (let t = 0; t < TRACKS; t++) {
      for (let s = 0; s < STEPS; s++) {
        const x = GX + s * STRIDE;
        const y = GY + t * (CH + GAP);
        if (
          p.mouseX >= x &&
          p.mouseX < x + CW &&
          p.mouseY >= y &&
          p.mouseY < y + CH
        ) {
          grid[t][s] = !grid[t][s];
          if (grid[t][s]) sounds[t]();
          return;
        }
      }
    }

    // Play / Stop ボタン
    const ty = GY + TRACKS * (CH + GAP) + 12;
    if (
      p.mouseX >= 12 &&
      p.mouseX < 76 &&
      p.mouseY >= ty &&
      p.mouseY < ty + 26
    ) {
      togglePlay();
      return;
    }

    // Clear ボタン
    if (
      p.mouseX >= 84 &&
      p.mouseX < 134 &&
      p.mouseY >= ty &&
      p.mouseY < ty + 26
    ) {
      for (let t = 0; t < TRACKS; t++) grid[t].fill(false);
      return;
    }
  };

  // スペースキーで再生/停止
  p.keyPressed = () => {
    if (p.key === " ") {
      initAudio();
      togglePlay();
      return false;
    }
  };

  function togglePlay() {
    playing = !playing;
    if (playing) {
      currentStep = -1;
      lastStepTime = p.millis();
    }
  }
}
