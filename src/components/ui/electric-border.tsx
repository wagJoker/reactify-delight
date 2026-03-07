/**
 * @module components/ui/electric-border
 * @description Electric border effect from reactbits.dev — SVG turbulence-based animated glow border.
 */
import React, {
  type CSSProperties,
  type PropsWithChildren,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from "react";

type ElectricBorderProps = PropsWithChildren<{
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
}>;

function hexToRgba(hex: string, alpha: number): string {
  // Support rgb/rgba/hsl pass-through
  if (!hex.startsWith("#")) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = "#5227FF",
  speed = 1,
  chaos = 0.12,
  borderRadius = 16,
  thickness = 2,
  className,
  style,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rawId = useId().replace(/[:]/g, "");
  const filterId = `turbulent-displace-${rawId}`;

  // Resize observer to keep SVG matching container size
  useLayoutEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      svg.setAttribute("width", `${width}`);
      svg.setAttribute("height", `${height}`);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const rect = svg.querySelector("rect");
      if (rect) {
        rect.setAttribute("width", `${width}`);
        rect.setAttribute("height", `${height}`);
        rect.setAttribute("rx", `${borderRadius}`);
        rect.setAttribute("ry", `${borderRadius}`);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    return () => observer.disconnect();
  }, [borderRadius]);

  // Animate turbulence
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const turbulence = svg.querySelector("feTurbulence");
    if (!turbulence) return;

    let frame: number;
    let seed = 0;
    const animate = () => {
      seed += speed;
      turbulence.setAttribute("seed", `${Math.floor(seed)}`);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  const wrapperStyle: CSSProperties = {
    ...style,
    borderRadius: `${borderRadius}px`,
  };

  const glowStyle: CSSProperties = {
    position: "absolute",
    inset: `-${thickness}px`,
    borderRadius: `${borderRadius}px`,
    background: `linear-gradient(-30deg, ${hexToRgba(color, 0.8)}, transparent, ${color})`,
    filter: `blur(${thickness}px)`,
    opacity: 0.6,
    pointerEvents: "none",
  };

  return (
    <div
      ref={rootRef}
      className={"relative isolate " + (className ?? "")}
      style={wrapperStyle}
    >
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 z-[1]"
        fill="none"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="turbulence"
              baseFrequency={chaos}
              numOctaves={1}
              result="turbulence"
              seed={0}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={20}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <rect
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          filter={`url(#${filterId})`}
        />
      </svg>

      {/* Glow layer */}
      <div style={glowStyle} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
};

export default ElectricBorder;
