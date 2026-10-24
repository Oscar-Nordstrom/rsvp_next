import type { ReactNode } from "react";

const ROSE = "#c98a86";
const BLUSH = "#e6bfb8";
const GOLD = "#d9a53f";
const LEAF = "#8fa382";
const STEM = "#7f9472";

function Flower({
  x,
  y,
  size,
  rotate = 0,
  color,
}: {
  x: number;
  y: number;
  size: number;
  rotate?: number;
  color: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 10})`}>
      <g fill={color}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-6"
            rx="4.6"
            ry="6"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
      <circle r="2.6" fill={GOLD} />
    </g>
  );
}

function Leaf({
  x,
  y,
  rotate,
  scale = 1,
}: {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      d="M0 0 C5 -6 15 -6 20 0 C15 6 5 6 0 0Z"
      fill={LEAF}
    />
  );
}

// A flowering garland drawn for the top-left corner: a long arm along the
// top edge and a short one down the side, so it frames content without
// eating much vertical space. The bottom-right copy is rotated 180°.
function Sprig({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 320 90"
      aria-hidden
      className={`pointer-events-none absolute w-[72%] max-w-[300px] sm:w-[380px] sm:max-w-none ${className}`}
    >
      <g fill="none" stroke={STEM} strokeWidth="1.4" strokeLinecap="round">
        <path d="M-5 22 C80 40 180 12 305 28" />
        <path d="M18 -5 C26 30 14 55 20 76" />
        <path d="M58 46 C70 56 80 62 92 68" />
      </g>
      <Leaf x={70} y={34} rotate={-35} scale={1.1} />
      <Leaf x={100} y={28} rotate={30} />
      <Leaf x={158} y={24} rotate={-30} />
      <Leaf x={185} y={22} rotate={25} scale={0.9} />
      <Leaf x={242} y={20} rotate={-25} scale={0.9} />
      <Leaf x={266} y={24} rotate={25} scale={0.8} />
      <Leaf x={22} y={58} rotate={45} scale={0.9} />
      <Leaf x={19} y={66} rotate={130} scale={0.8} />
      <Leaf x={70} y={55} rotate={-10} scale={0.7} />
      <Leaf x={74} y={58} rotate={80} scale={0.7} />
      <Flower x={132} y={27} size={12} rotate={15} color={BLUSH} />
      <Flower x={214} y={21} size={10} rotate={-10} color={ROSE} />
      <Flower x={285} y={26} size={8} rotate={20} color={BLUSH} />
      <Flower x={92} y={68} size={8} rotate={20} color={ROSE} />
      <Flower x={38} y={34} size={22} rotate={10} color={ROSE} />
      <circle cx="305" cy="28" r="3.5" fill={ROSE} />
      <circle cx="20" cy="78" r="3.5" fill={ROSE} />
      <g fill={GOLD} opacity="0.7">
        <circle cx="172" cy="40" r="1.8" />
        <circle cx="252" cy="36" r="1.8" />
        <circle cx="112" cy="50" r="1.6" />
        <circle cx="44" cy="70" r="1.6" />
      </g>
    </svg>
  );
}

// Frames its children with a garland at the top-left and bottom-right.
// On phones the frame spans the screen, so the garlands sit at its edges;
// from `sm` up it hugs the content column and the garlands reach out past it.
export default function FloralFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col overflow-x-hidden sm:justify-center sm:py-12">
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

// A small centered flourish: a line, a flower, a line.
export function FloralDivider() {
  return (
    <svg
      viewBox="0 0 120 20"
      aria-hidden
      className="mx-auto h-5 w-32"
    >
      <g stroke={STEM} strokeWidth="1" strokeLinecap="round">
        <path d="M8 10 H46" />
        <path d="M74 10 H112" />
      </g>
      <Leaf x={46} y={10} rotate={-150} scale={0.45} />
      <Leaf x={74} y={10} rotate={-30} scale={0.45} />
      <Flower x={60} y={10} size={8} color={ROSE} />
    </svg>
  );
}
