# Web制作で使われるビジュアルエフェクト集

p5.jsで学ぶ描画テクニックが、実際のWeb制作でどう使われているかをまとめたリファレンスです。
`sketch-ideas.md` の対応番号がある項目は、p5.jsで原理を学べます。

---

## 1. スクロール系

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W01 | パララックス | 背景と前景の移動速度差で奥行きを演出。ヒーローセクションの定番 | GSAP ScrollTrigger, Lenis, CSS perspective | — |
| W02 | スクロールリビール | 要素がビューポートに入るタイミングでフェード/スライドで出現 | GSAP ScrollTrigger, AOS, Intersection Observer | — |
| W03 | セクションピニング | スクロール中にセクションを固定し、中でアニメーションを再生 | GSAP ScrollTrigger pin | — |
| W04 | 横スクロール変換 | 縦スクロールを横方向のスライドに変換。ギャラリーやタイムラインに | GSAP ScrollTrigger, CSS scroll-snap | — |
| W05 | スクロール連動アニメ | スクロール量に1:1で連動する再生。動画のスクラブ操作のような体験 | GSAP scrub, CSS animation-timeline | — |
| W06 | スムーススクロール | 慣性付きの滑らかなスクロール。クリエイティブサイトでは標準的 | Lenis（現在の業界標準, 3KB）, Locomotive Scroll | — |
| W07 | 速度連動マーキー | ロゴやテキストの横スクロールがユーザーのスクロール速度に追従 | GSAP, Motion, CSS animation | — |
| W08 | スクロールスナップ | スクロール位置が所定ポイントにスナップ。スライド型ページに | CSS scroll-snap-type | — |

## 2. カーソル・マウス系

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W09 | カスタムカーソル | デフォルトカーソルを隠し、遅延追従するドット＋リングで置換 | Vanilla JS, GSAP, Motion | 03 |
| W10 | マグネティックボタン | カーソル接近時にボタンがカーソル方向に吸い寄せられる | JS距離計算 + transform, GSAP | 03 |
| W11 | ホバーディストーション | 画像ホバー時にWebGLシェーダーで波紋・歪みを適用 | Three.js + GLSL, OGL, VFX-JS | 41 |
| W12 | カーソルトレイル | カーソルの軌跡に粒子やブラーが減衰しながら続く | Canvas 2D, WebGL | 03 |
| W13 | カーソル反応背景 | マウス位置に応じて背景のグラデーション・光源・粒子が変化 | CSS custom properties + JS, Three.js, Canvas | 21 |

## 3. テキストアニメーション

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W14 | スプリットテキスト | 文字/単語/行に分割し、stagger付きでスライド・フェードイン | GSAP SplitText, Splitting.js | 06 |
| W15 | タイピングエフェクト | 1文字ずつ表示されるタイプライター風。AI系サイトで頻出 | CSS steps(), Typed.js | 06 |
| W16 | キネティックタイポ | 文字が動的に回転・拡縮・跳ねる。スクロールやマウスにも反応 | GSAP + SplitText, Motion | 37 |
| W17 | テキストスクランブル | ランダム文字が切り替わりながら最終テキストに収束する暗号解読風 | カスタムJS, GSAP TextPlugin | — |
| W18 | スクロール連動テキスト着色 | スクロールに応じて文字が順に色付き。カラオケのプロンプター風 | GSAP ScrollTrigger scrub, CSS background-clip | — |
| W19 | 巨大タイポグラフィ | ビューポート幅いっぱいの大文字。スクロールで移動・拡縮 | GSAP, CSS clamp()/vw | — |

## 4. 背景エフェクト

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W20 | アニメーショングラデーション | 色がゆっくり流れ・変化する背景。Stripe風のメッシュグラデが代表格 | CSS @keyframes, CSS @property, WebGL | 04 |
| W21 | パーティクル背景 | 小さな粒子が浮遊・接続線を描く。テック系サイトの定番 | tsParticles, Three.js, Canvas 2D | 14, 21 |
| W22 | ノイズ/グレインテクスチャ | フィルムのようなざらつきをオーバーレイ。暗色背景で特に効果的 | CSS SVG feTurbulence, Canvas noise, GLSL | 21, 22 |
| W23 | ブロブ/有機的シェイプ | ぼやけた半透明のアメーバ状の形がゆっくり変形しながら漂う | CSS border-radius animation, SVG, Canvas | 41 |
| W24 | グロー/動的ライティング | 暗い背景上で光源が脈動・移動。グラスモーフィズムUIと相性抜群 | CSS box-shadow/blur/radial-gradient, WebGL | — |
| W25 | オーロラエフェクト | 北極光のような色帯が流れる。2024-25年のプレミアム背景トレンド | CSS animated gradient + blur, WebGL shaders | 21 |

## 5. ページトランジション

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W26 | SPA風ページ遷移 | 非同期でコンテンツ取得し、アニメーション付きで差し替え | Barba.js（4.4KB, 標準）, Swup.js | — |
| W27 | clip-pathリビール遷移 | 円や多角形のクリップパスが拡大して新ページを露出 | CSS clip-path, GSAP, Barba.js | — |
| W28 | カーテン遷移 | 色面がスライドして旧コンテンツを覆い、逆方向に開いて新コンテンツ表示 | Barba.js + GSAP timeline | — |
| W29 | 共有要素モーフ遷移 | サムネ→詳細ページでカードが滑らかに拡大変形して連続性を演出 | View Transitions API（ブラウザ標準）, FLIP技法, Motion | — |
| W30 | View Transitions API | ブラウザ標準のページ遷移API。スナップショット→クロスフェード | `document.startViewTransition()`, Astro組み込み対応 | — |

## 6. 3D / WebGL

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W31 | シェーダー背景 | GPUシェーダーで生成するプロシージャルな背景アニメーション | Three.js + GLSL, WebGPU | 21, 22 |
| W32 | 3Dプロダクトビューア | 製品3Dモデルを回転・ズーム操作。スクロール連動カメラ移動も | Three.js, React Three Fiber, Spline | 42, 43 |
| W33 | 画像ディスプレイスメント | 変位マップでホバー/スクロール時に画像が液体のように歪む | Three.js + displacement map, GLSL | 39 |
| W34 | 3Dテキスト | 文字を3Dジオメトリとして描画。ライティングと質感付き | Three.js TextGeometry, Spline | 42 |
| W35 | ポストプロセス | ブルーム(発光)・色収差・フィルムグレイン等のフルスクリーンGPU効果 | Three.js EffectComposer, postprocessing | — |
| W36 | デプスマップ擬似3D | 2D画像＋深度マップでカーソル/スクロールに反応する立体的な視差 | Three.js + depth map shader | — |

## 7. マイクロインタラクション

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W37 | ボタンプレスフィードバック | クリック時にscale縮小、リップル波紋、バウンス等の触覚的反応 | CSS transform + transition, Material ripple | — |
| W38 | ホバーステートアニメ | 下線のドローオン/オフ、背景色スライド、アイコンシフト等 | CSS transition + :hover, 疑似要素 | — |
| W39 | スケルトンローディング | コンテンツ読み込み中に灰色の骨格がシマー（光沢波）する | CSS @keyframes + linear-gradient | — |
| W40 | トグルアニメーション | スイッチのノブスライド＋背景色変化。ダークモード切替で頻出 | CSS transitions, Motion, Lottie | — |
| W41 | フォームフィールド演出 | フォーカス時のラベル浮上、ボーダー色変化、バリデーション遷移 | CSS :focus-within + transition | — |
| W42 | スクロール進捗バー | ページ上部の細いバーがスクロール量に応じて伸びる | CSS animation-timeline: scroll()（JS不要） | — |

## 8. 画像・メディア系

| # | エフェクト | 解説 | 実装技術 | sketch-ideas |
|---|-----------|------|----------|:---:|
| W43 | パララックスイメージ | 画像が周囲と異なる速度でスクロール。浮いているような奥行き | GSAP ScrollTrigger, CSS background-attachment | — |
| W44 | 画像リビール/マスク | アニメーションするマスクが画像を徐々に露出。ポートフォリオの定番 | CSS clip-path animation, GSAP, overflow hidden | — |
| W45 | スクロールズーム（ケンバーンズ） | スクロール通過時に画像がゆっくりズームイン/アウト。映画的 | GSAP ScrollTrigger scale, CSS transform | — |
| W46 | ホバー画像追従表示 | テキストリンクのホバーでカーソル付近に画像がふわっと出現 | JS mousemove + absolute position, GSAP | — |
| W47 | スクロール連動ビデオ | スクロール量で動画の再生位置を制御。スクラブ操作的な体験 | JS video.currentTime, 連番画像（Apple方式） | — |
| W48 | 無限マーキー | ロゴやサムネが無限に横スクロール。スクロール速度に連動も | CSS animation + 複製, Motion Ticker | — |
| W49 | ピクセルソート/グリッチ | ピクセルを明度等で並び替えるデジタルグリッチ。ホバー発動が多い | Canvas 2D pixel操作, WebGL shaders | 39 |

---

## 主要ライブラリ一覧

| ライブラリ | 用途 | 備考 |
|-----------|------|------|
| **GSAP + ScrollTrigger** | スクロールアニメ全般、タイムライン、テキスト分割 | 業界標準。2024年にWebflow買収後フリー化 |
| **Lenis** | スムーススクロールエンジン | 3KB。Locomotive Scrollの後継的存在 |
| **Three.js / R3F** | 3Dシーン、シェーダー、WebGL全般 | Web3Dのデファクトスタンダード |
| **Barba.js** | ページ遷移（MPAをSPA風に） | 4.4KB。GSAPと組み合わせて使う |
| **Motion（旧Framer Motion）** | Reactコンポーネントアニメーション | npm月間1800万DL以上 |
| **Lottie** | After Effectsからのベクターアニメ書き出し | アイコン、ローディング、イラスト |
| **tsParticles** | パーティクルシステム | particles.jsの後継 |
| **VFX-JS** | 簡易WebGLエフェクト | 2025年登場。シェーダーの敷居を下げる |
| **Spline** | 3Dデザインツール＋Web書き出し | デザイナー向けのThree.js代替 |
| **View Transitions API** | ブラウザ標準のページ遷移 | 2024-25年でサポート拡大中 |
| **CSS Scroll-Driven Animations** | スクロール連動アニメ（JS不要） | 2024年ブラウザ標準化が進行中 |
