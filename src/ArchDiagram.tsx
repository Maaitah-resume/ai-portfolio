// Live architecture diagrams shown on the back of each project card.
// Coordinates are in a 360 × 210 box; edges run between node centers and
// the boxes are drawn on top, so lines appear to leave from their edges.

type Node = { id: string; label: string; x: number; y: number; accent?: boolean }
type Diagram = { nodes: Node[]; edges: [string, string][]; caption: string }

export const diagrams: Record<string, Diagram> = {
  'Federated Learning IDS': {
    nodes: [
      { id: 'c1', label: 'Browser 1', x: 50, y: 30 },
      { id: 'c2', label: 'Browser 2', x: 50, y: 80 },
      { id: 'c3', label: 'Browser 3', x: 50, y: 130 },
      { id: 'c4', label: 'Browser 4', x: 50, y: 180 },
      { id: 'mask', label: 'Pairwise mask', x: 175, y: 105 },
      { id: 'agg', label: 'Meta-aggregator', x: 300, y: 70, accent: true },
      { id: 'model', label: 'Global model', x: 300, y: 150 },
    ],
    edges: [['c1', 'mask'], ['c2', 'mask'], ['c3', 'mask'], ['c4', 'mask'], ['mask', 'agg'], ['agg', 'model'], ['model', 'c4']],
    caption: 'Browsers train locally with TensorFlow.js; only masked weight updates leave the device.',
  },
  'Guard Layer': {
    nodes: [
      { id: 'src', label: 'Email · CRM · Web', x: 60, y: 35 },
      { id: 's0', label: 'Tag source', x: 60, y: 105 },
      { id: 's1', label: 'Heuristic filter', x: 180, y: 105 },
      { id: 's2', label: 'LLM judge', x: 180, y: 180, accent: true },
      { id: 'gate', label: 'Gate', x: 300, y: 105 },
      { id: 'agent', label: 'AI agent', x: 300, y: 35 },
    ],
    edges: [['src', 's0'], ['s0', 's1'], ['s1', 'gate'], ['s1', 's2'], ['s2', 'gate'], ['gate', 'agent']],
    caption: 'Untrusted content is tagged and filtered; only flagged items pay for an LLM verdict.',
  },
  'Leukemia Cell Segmentation': {
    nodes: [
      { id: 'img', label: 'Blood smear', x: 50, y: 105 },
      { id: 'pre', label: 'Preprocess', x: 140, y: 40 },
      { id: 'enc', label: 'ResNet50 encoder', x: 150, y: 170 },
      { id: 'dec', label: 'U-Net decoder', x: 255, y: 105, accent: true },
      { id: 'mask', label: 'Mask', x: 315, y: 30 },
      { id: 'heat', label: 'Heatmap', x: 315, y: 180 },
    ],
    edges: [['img', 'pre'], ['pre', 'enc'], ['enc', 'dec'], ['dec', 'mask'], ['dec', 'heat']],
    caption: 'Resize, normalize and augment, then segment; cell count and area come from the mask.',
  },
  'Velocity Charging Portal': {
    nodes: [
      { id: 'data', label: 'Charging sessions', x: 65, y: 105 },
      { id: 'reg', label: 'Cost + duration', x: 190, y: 40, accent: true },
      { id: 'iso', label: 'Isolation Forest', x: 190, y: 170 },
      { id: 'xai', label: 'SHAP · LIME', x: 300, y: 40 },
      { id: 'rec', label: 'Fuzzy + RL tips', x: 300, y: 105 },
      { id: 'alert', label: 'Anomaly flags', x: 300, y: 170 },
    ],
    edges: [['data', 'reg'], ['data', 'iso'], ['reg', 'xai'], ['reg', 'rec'], ['iso', 'alert']],
    caption: 'Every prediction is explained, and unusual sessions are flagged as they arrive.',
  },
  'Fitness AI Assistant': {
    nodes: [
      { id: 'user', label: 'User chat', x: 55, y: 105 },
      { id: 'api', label: 'FastAPI', x: 160, y: 105, accent: true },
      { id: 'rules', label: 'Profile rules', x: 280, y: 30 },
      { id: 'gem', label: 'Gemini', x: 290, y: 105 },
      { id: 'db', label: 'SQLite history', x: 160, y: 185 },
      { id: 'nb', label: 'Analytics', x: 290, y: 185 },
    ],
    edges: [['user', 'api'], ['api', 'rules'], ['api', 'gem'], ['gem', 'user'], ['api', 'db'], ['db', 'nb']],
    caption: 'Rules build your profile; Gemini writes the advice; every turn is stored for analysis.',
  },
  'NLP Foundations': {
    nodes: [
      { id: 'raw', label: 'Raw text', x: 50, y: 50 },
      { id: 'stem', label: 'Stemming', x: 160, y: 50 },
      { id: 'emb', label: 'Embeddings', x: 280, y: 50 },
      { id: 'lstm', label: 'LSTM', x: 280, y: 160, accent: true },
      { id: 'out', label: 'Prediction', x: 140, y: 160 },
    ],
    edges: [['raw', 'stem'], ['stem', 'emb'], ['emb', 'lstm'], ['lstm', 'out']],
    caption: 'From normalized words to dense vectors to a sequence model.',
  },
}

const W = 96
const H = 26

function path(a: Node, b: Node) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  // Bend horizontal links slightly so parallel edges don't overlap.
  return Math.abs(a.x - b.x) > Math.abs(a.y - b.y)
    ? `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`
    : `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`
}

export default function ArchDiagram({ name, live }: { name: string; live: boolean }) {
  const d = diagrams[name]
  if (!d) return null
  const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]))
  return (
    <figure className="arch">
      <svg viewBox="0 0 360 210" role="img" aria-label={`${name} architecture: ${d.caption}`}>
        {d.edges.map(([a, b], i) => {
          const p = path(byId[a], byId[b])
          return (
            <g key={i}>
              <path d={p} className="arch-edge" />
              {live && (
                <circle r="3" className="arch-signal">
                  <animateMotion dur="2.2s" begin={`${(i * 0.35) % 2.2}s`} repeatCount="indefinite" path={p} />
                </circle>
              )}
            </g>
          )
        })}
        {d.nodes.map((n) => (
          <g key={n.id} className={`arch-node${n.accent ? ' accent' : ''}`}>
            <rect x={n.x - W / 2} y={n.y - H / 2} width={W} height={H} rx="7" />
            <text x={n.x} y={n.y + 4}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>{d.caption}</figcaption>
    </figure>
  )
}
