import type { ReactNode } from "react";

// Watercolor-and-gold foliage to match the printed invitation: sage leaves,
// gold-leaf leaves, gold outline leaves, eucalyptus and small berries.

const STEM = "#4f5a45";
const GOLD = "#b8862b";
const BERRY = "#56654b";
const SAGE = ["#6b7a5e", "#8a9879", "#a3ae93", "#7c8b6c", "#95a385"];

type Point = [number, number];
type Curve = [Point, Point, Point, Point];
type LeafKind = "sage" | "gold" | "outline" | "eucalyptus";

const LEAF_PATH = "M0 0 C6 -7 18 -8 28 0 C18 6 6 5 0 0Z";
const EUCALYPTUS_PATH = "M0 0 C1 -8 13 -9 15 0 C13 8 1 8 0 0Z";

// Point and tangent angle (degrees) at `t` along a cubic Bézier.
function pointOnCurve([p0, p1, p2, p3]: Curve, t: number) {
  const u = 1 - t;
  const at = (i: 0 | 1) =>
    u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
  const slope = (i: 0 | 1) =>
    3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]);
  return {
    x: at(0),
    y: at(1),
    angle: (Math.atan2(slope(1), slope(0)) * 180) / Math.PI,
  };
}

function Leaf({
  x,
  y,
  angle,
  scale,
  kind,
  shade,
}: {
  x: number;
  y: number;
  angle: number;
  scale: number;
  kind: LeafKind;
  shade: number;
}) {
  const transform = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)})`;

  if (kind === "eucalyptus") {
    return (
      <g transform={transform}>
        <path d="M0 0 H4" stroke={STEM} strokeWidth="0.8" />
        <path
          d={EUCALYPTUS_PATH}
          transform="translate(3 0)"
          fill={SAGE[shade % SAGE.length]}
          fillOpacity="0.6"
        />
      </g>
    );
  }
  if (kind === "gold") {
    return (
      <g transform={transform}>
        <path d={LEAF_PATH} fill="url(#floral-gold)" filter="url(#floral-glitter)" />
        <path d={LEAF_PATH} fill="none" stroke={GOLD} strokeWidth="0.6" />
      </g>
    );
  }
  if (kind === "outline") {
    return (
      <g transform={transform}>
        <path d={LEAF_PATH} fill={GOLD} fillOpacity="0.08" stroke={GOLD} strokeWidth="0.7" />
        <path d="M1 0 C9 -1 18 -1 26 0" fill="none" stroke={GOLD} strokeWidth="0.5" />
      </g>
    );
  }
  return (
    <g transform={transform}>
      <path
        d={LEAF_PATH}
        fill={SAGE[shade % SAGE.length]}
        fillOpacity={0.55 + (shade % 3) * 0.12}
      />
      <path
        d="M1 0 C9 -1 18 -1 25 0"
        fill="none"
        stroke={STEM}
        strokeOpacity="0.35"
        strokeWidth="0.5"
      />
    </g>
  );
}

// A stem along `curve` with leaves alternating left and right of it,
// shrinking towards the tip, and one leaf continuing the stem at the end.
function Branch({
  curve,
  count,
  kind,
  size = 1,
  seed = 0,
}: {
  curve: Curve;
  count: number;
  kind: LeafKind;
  size?: number;
  seed?: number;
}) {
  const [p0, p1, p2, p3] = curve;
  const leaves = Array.from({ length: count }, (_, i) => {
    const t = 0.15 + (0.8 * i) / Math.max(count - 1, 1);
    const { x, y, angle } = pointOnCurve(curve, t);
    const side = i % 2 === 0 ? -1 : 1;
    const jitter = ((i * 7 + seed * 3) % 5) * 4;
    return (
      <Leaf
        key={i}
        x={x}
        y={y}
        angle={angle + side * (40 + jitter)}
        scale={size * (1 - t * 0.4)}
        kind={kind}
        shade={i + seed}
      />
    );
  });
  const tip = pointOnCurve(curve, 1);

  return (
    <g>
      <path
        d={`M${p0} C${p1} ${p2} ${p3}`}
        fill="none"
        stroke={kind === "outline" ? GOLD : STEM}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {leaves}
      <Leaf
        x={tip.x}
        y={tip.y}
        angle={tip.angle}
        scale={size * 0.6}
        kind={kind}
        shade={count + seed}
      />
    </g>
  );
}

function Berries({ x, y, angle }: { x: number; y: number; angle: number }) {
  const berries: Point[] = [
    [10, 0],
    [16, -5],
    [17, 4],
    [23, -1],
    [26, -8],
    [28, 6],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d="M0 0 C8 0 16 -1 24 -1" fill="none" stroke={STEM} strokeWidth="0.7" />
      {berries.map(([bx, by], i) => (
        <g key={i}>
          <path d={`M${bx - 4} ${by * 0.4} L${bx} ${by}`} stroke={STEM} strokeWidth="0.5" />
          <circle cx={bx} cy={by} r={2.4 - i * 0.15} fill={BERRY} fillOpacity="0.85" />
        </g>
      ))}
    </g>
  );
}

// Gradient and glitter texture shared by every gold leaf on the page.
function FloralDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="floral-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8761f" />
          <stop offset="0.5" stopColor="#e3c27a" />
          <stop offset="1" stopColor="#b8862b" />
        </linearGradient>
        <filter id="floral-glitter" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="4" />
          <feColorMatrix
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 9 -3.2"
            result="speckle"
          />
          <feComposite in="SourceGraphic" in2="speckle" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

// The foliage drawn for the top-left corner: a long arm along the top edge
// and a short one down the side, so it frames content without eating much
// vertical space. The bottom-right copy is rotated 180°.
function Sprig({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 320 110"
      aria-hidden
      overflow="visible"
      className={`pointer-events-none absolute w-[80%] max-w-[330px] sm:w-[420px] sm:max-w-none ${className}`}
    >
      <Branch curve={[[0, 30], [40, 52], [100, 55], [160, 64]]} count={4} kind="outline" size={1.3} seed={2} />
      <Branch curve={[[22, 0], [28, 25], [30, 48], [26, 72]]} count={3} kind="outline" size={1.1} seed={1} />
      <Branch curve={[[120, 20], [170, 8], [220, 6], [285, 10]]} count={3} kind="outline" size={1} seed={3} />
      <Branch curve={[[-5, 14], [80, 30], [180, 6], [300, 22]]} count={11} kind="sage" size={1.3} />
      <Branch curve={[[0, 8], [40, 20], [80, 24], [125, 36]]} count={5} kind="sage" size={1.35} seed={4} />
      <Branch curve={[[8, -5], [14, 25], [4, 45], [12, 72]]} count={4} kind="sage" size={1.15} seed={3} />
      <Branch curve={[[5, 10], [30, 30], [52, 48], [78, 66]]} count={4} kind="sage" size={1.2} seed={1} />
      <Branch curve={[[40, 16], [80, 2], [120, 4], [165, 0]]} count={5} kind="eucalyptus" size={1} seed={2} />
      <Branch curve={[[0, 24], [60, 40], [120, 30], [200, 40]]} count={5} kind="gold" size={1.2} seed={1} />
      <Branch curve={[[160, 14], [195, 28], [230, 30], [262, 38]]} count={3} kind="gold" size={0.9} seed={4} />
      <Berries x={225} y={20} angle={-15} />
      <Berries x={50} y={40} angle={40} />
    </svg>
  );
}

// Frames its children with foliage at the top-left and bottom-right.
// On phones the frame spans the screen, so the foliage sits at its edges;
// from `sm` up it hugs the content column and reaches out past it.
export default function FloralFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col overflow-x-hidden sm:justify-center sm:py-12">
      <FloralDefs />
      <div
        className={`relative mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-20 sm:flex-none sm:px-12 sm:py-28 ${className}`}
      >
        <Sprig className="left-0 top-0 sm:-left-16 sm:top-0" />
        <Sprig className="bottom-0 right-0 rotate-180 sm:-right-16 sm:bottom-0" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

// A small centered flourish: gold hairlines either side of a leaf pair.
export function FloralDivider() {
  return (
    <svg viewBox="0 0 120 20" aria-hidden className="mx-auto h-5 w-32">
      <g stroke={GOLD} strokeWidth="0.8" strokeLinecap="round">
        <path d="M6 10 H44" />
        <path d="M76 10 H114" />
      </g>
      <Leaf x={60} y={10} angle={-160} scale={0.5} kind="sage" shade={0} />
      <Leaf x={60} y={10} angle={-20} scale={0.5} kind="sage" shade={3} />
      <Leaf x={60} y={10} angle={-90} scale={0.35} kind="outline" shade={0} />
      <circle cx="60" cy="10" r="1.6" fill={GOLD} />
    </svg>
  );
}
