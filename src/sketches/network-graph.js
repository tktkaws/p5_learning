// ネットワークグラフ — 力学モデル（Force-Directed Layout）で自動配置
export default function (p) {
  const W = 400;
  const H = 400;

  const NODE_MIN = 10;
  const NODE_MAX = 15;

  // 力学パラメータ
  const REPULSION = 3000;   // ノード間の反発力（クーロン定数）
  const SPRING_K = 0.005;   // バネ定数
  const SPRING_LEN = 80;    // バネの自然長
  const DAMPING = 0.9;      // 減衰係数
  const CENTER_PULL = 0.01; // 中心への引力

  let nodes = [];
  let edges = [];
  let dragNode = null;
  let dragged = false;

  p.setup = () => {
    p.createCanvas(W, H);
    p.colorMode(p.HSB, 360, 100, 100, 1.0);
    p.textFont("sans-serif");
    generateGraph();
  };

  function generateGraph() {
    nodes = [];
    edges = [];

    const count = p.floor(p.random(NODE_MIN, NODE_MAX + 1));

    // ノード生成 — 中央付近にランダム配置
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: W / 2 + p.random(-100, 100),
        y: H / 2 + p.random(-100, 100),
        vx: 0,
        vy: 0,
        id: i,
      });
    }

    // エッジ生成 — 全ノードが最低1本の接続を持つように
    const connected = new Set();

    // まずスパニングツリーを作って全接続を保証
    const order = p.shuffle([...Array(count).keys()]);
    for (let i = 1; i < order.length; i++) {
      const a = order[i - 1];
      const b = order[i];
      edges.push({ a, b });
      connected.add(a);
      connected.add(b);
    }

    // 追加のランダムエッジ
    const extraEdges = p.floor(p.random(count * 0.3, count * 0.8));
    for (let i = 0; i < extraEdges; i++) {
      const a = p.floor(p.random(count));
      const b = p.floor(p.random(count));
      if (a !== b && !hasEdge(a, b)) {
        edges.push({ a, b });
      }
    }

    // 各ノードの接続数を計算
    for (const node of nodes) {
      node.degree = 0;
    }
    for (const edge of edges) {
      nodes[edge.a].degree++;
      nodes[edge.b].degree++;
    }
  }

  function hasEdge(a, b) {
    return edges.some(
      (e) => (e.a === a && e.b === b) || (e.a === b && e.b === a)
    );
  }

  p.draw = () => {
    p.background(220, 5, 98);

    applyForces();
    updatePositions();
    drawEdges();
    drawNodes();
    drawHint();
  };

  function applyForces() {
    // 力をリセット
    for (const node of nodes) {
      node.fx = 0;
      node.fy = 0;
    }

    // ノード間の反発力（クーロン力）
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = p.sqrt(dx * dx + dy * dy);
        dist = p.max(dist, 1);

        const force = REPULSION / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        a.fx -= fx;
        a.fy -= fy;
        b.fx += fx;
        b.fy += fy;
      }
    }

    // エッジのバネ引力（フックの法則）
    for (const edge of edges) {
      const a = nodes[edge.a];
      const b = nodes[edge.b];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = p.sqrt(dx * dx + dy * dy);
      dist = p.max(dist, 1);

      const displacement = dist - SPRING_LEN;
      const force = SPRING_K * displacement;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      a.fx += fx;
      a.fy += fy;
      b.fx -= fx;
      b.fy -= fy;
    }

    // 中心への引力（散らばりすぎ防止）
    for (const node of nodes) {
      node.fx += (W / 2 - node.x) * CENTER_PULL;
      node.fy += (H / 2 - node.y) * CENTER_PULL;
    }
  }

  function updatePositions() {
    for (const node of nodes) {
      // ドラッグ中のノードは物理を無視
      if (node === dragNode) continue;

      node.vx = (node.vx + node.fx) * DAMPING;
      node.vy = (node.vy + node.fy) * DAMPING;

      node.x += node.vx;
      node.y += node.vy;

      // キャンバス内に収める
      const margin = 20;
      node.x = p.constrain(node.x, margin, W - margin);
      node.y = p.constrain(node.y, margin, H - margin);
    }
  }

  function drawEdges() {
    p.strokeWeight(1.5);
    for (const edge of edges) {
      const a = nodes[edge.a];
      const b = nodes[edge.b];
      p.stroke(220, 10, 70, 0.5);
      p.line(a.x, a.y, b.x, b.y);
    }
  }

  function drawNodes() {
    for (const node of nodes) {
      const radius = p.map(node.degree, 1, 6, 10, 22);
      const hue = p.map(node.degree, 1, 6, 200, 330);
      const isHovered = isOverNode(node, p.mouseX, p.mouseY);
      const isDragging = node === dragNode;

      // 影
      p.noStroke();
      p.fill(220, 5, 60, 0.15);
      p.circle(node.x + 2, node.y + 2, radius * 2);

      // ノード本体
      p.fill(hue, 60, isDragging ? 95 : isHovered ? 90 : 80);
      p.stroke(hue, 60, 50);
      p.strokeWeight(isDragging ? 2.5 : isHovered ? 2 : 1.5);
      p.circle(node.x, node.y, radius * 2);

      // ラベル
      p.noStroke();
      p.fill(0, 0, 100);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(node.id, node.x, node.y);
    }
  }

  function drawHint() {
    p.noStroke();
    p.fill(220, 5, 60);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("ドラッグ: ノード移動｜空白クリック: 再生成", W / 2, H - 8);
  }

  function isOverNode(node, mx, my) {
    const radius = p.map(node.degree, 1, 6, 10, 22);
    return p.dist(mx, my, node.x, node.y) < radius;
  }

  function findNodeAt(mx, my) {
    // 前面（後から描画された）ノードを優先
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (isOverNode(nodes[i], mx, my)) {
        return nodes[i];
      }
    }
    return null;
  }

  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > W || p.mouseY < 0 || p.mouseY > H) return;

    const hit = findNodeAt(p.mouseX, p.mouseY);
    if (hit) {
      dragNode = hit;
      dragged = false;
    }
  };

  p.mouseDragged = () => {
    if (dragNode) {
      dragNode.x = p.constrain(p.mouseX, 20, W - 20);
      dragNode.y = p.constrain(p.mouseY, 20, H - 20);
      dragNode.vx = 0;
      dragNode.vy = 0;
      dragged = true;
    }
  };

  p.mouseReleased = () => {
    if (dragNode) {
      if (!dragged) {
        // クリックだけでドラッグしなかった場合は何もしない
      }
      dragNode = null;
      dragged = false;
      return;
    }

    // 空白クリックで再生成
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      generateGraph();
    }
  };
}
