"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { VocabularyEntry } from "@/lib/types";

type WaterfallWord = Pick<VocabularyEntry, "id" | "word" | "meaning">;

type WordNode = WaterfallWord & {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
  drift: number;
  weight: number;
};

type Ripple = {
  x: number;
  y: number;
  start: number;
  strength: number;
};

type TooltipState = {
  word: string;
  meaning: string;
  x: number;
  y: number;
} | null;

type WordWaterfallProps = {
  vocabulary: WaterfallWord[];
  rippleSignal: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createNodes(words: WaterfallWord[], width: number, height: number) {
  const mobile = width < 720;
  const columnWidth = mobile ? 82 : 96;
  const rowHeight = mobile ? 36 : 31;
  const columns = Math.max(6, Math.ceil(width / columnWidth) + 2);
  const rows = Math.max(12, Math.ceil(height / rowHeight) + 10);
  const targetCount = Math.min(Math.floor(words.length * (mobile ? 1.15 : 1.55)), columns * rows);
  const nodes: WordNode[] = [];
  const sizePattern = mobile
    ? [18, 11, 13, 24, 10, 15, 12, 20, 10, 14, 28, 11]
    : [30, 12, 16, 42, 10, 21, 13, 34, 11, 18, 52, 14, 24, 10, 38, 12];

  for (let index = 0; index < targetCount; index += 1) {
    const word = words[index % words.length];
    const column = index % columns;
    const row = Math.floor(index / columns);
    const size = sizePattern[index % sizePattern.length];
    const rowWave = Math.sin(row * 0.72) * (mobile ? 10 : 18);
    const stagger = ((index * 37) % 31) - 15;
    const largeOffset = size >= 34 ? (index % 2 ? -14 : 18) : 0;
    nodes.push({
      ...word,
      x: column * columnWidth + 8 + stagger + rowWave + largeOffset,
      y: row * rowHeight - height * 0.34 + ((index * 19) % 17),
      speed: mobile ? 0.11 + (index % 4) * 0.006 : 0.16 + (index % 5) * 0.008,
      size,
      alpha:
        size >= 34
          ? mobile
            ? 0.065
            : 0.075
          : size <= 12
            ? 0.035
            : mobile
              ? 0.055
              : 0.065,
      drift: ((index % 11) - 5) * 0.1,
      weight: size >= 34 ? 750 : size >= 21 ? 650 : 520,
    });
  }

  return nodes;
}

export function WordWaterfall({ vocabulary, rippleSignal }: WordWaterfallProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<WordNode[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, movedAt: 0, active: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const reducedMotionRef = useRef(false);
  const lastTooltipRef = useRef<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const words = useMemo(
    () => vocabulary.filter((entry) => entry.word && entry.meaning),
    [vocabulary],
  );

  useEffect(() => {
    if (!rippleSignal || !sizeRef.current.width) return;
    ripplesRef.current.push({
      x: sizeRef.current.width * 0.58,
      y: sizeRef.current.height * 0.42,
      start: performance.now(),
      strength: reducedMotionRef.current ? 12 : 44,
    });
  }, [rippleSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !words.length) return undefined;
    const canvasElement = canvas;
    const context2d = context;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 720;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2);
      sizeRef.current = { width, height, dpr };
      canvasElement.width = Math.floor(width * dpr);
      canvasElement.height = Math.floor(height * dpr);
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodesRef.current = createNodes(words, width, height);
    }

    function handlePointerMove(event: PointerEvent) {
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        movedAt: performance.now(),
        active: event.pointerType !== "touch",
      };
    }

    function handlePointerLeave() {
      pointerRef.current.active = false;
      lastTooltipRef.current = null;
      setTooltip(null);
    }

    function draw(now: number) {
      const { width, height } = sizeRef.current;
      const pointer = pointerRef.current;
      const mobile = width < 720;
      const reducedMotion = reducedMotionRef.current;
      const frameFade = reducedMotion ? 0.68 : 0.58;
      let nearest: { node: WordNode; distance: number; x: number; y: number } | null = null;

      context2d.fillStyle = `rgba(246, 248, 251, ${frameFade})`;
      context2d.fillRect(0, 0, width, height);

      const activeRipples = ripplesRef.current.filter((ripple) => now - ripple.start < 1600);
      ripplesRef.current = activeRipples;

      for (const node of nodesRef.current) {
        if (!reducedMotion) {
          node.y += node.speed * (mobile ? 0.45 : 1);
          node.x += Math.sin(now * 0.00045 + node.y * 0.01) * node.drift * 0.025;
        }

        if (node.y > height + 48) {
          node.y = -28 - ((node.id.length * 13) % 80);
        }

        let drawX = node.x;
        let drawY = node.y;
        let glow = 0;

        if (pointer.active && !reducedMotion) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const radius = mobile ? 88 : 190;
          if (distance < radius) {
            const force = (1 - distance / radius) ** 1.7;
            const swirl = Math.sin(distance * 0.08 - now * 0.012) * force;
            drawX += (dx / Math.max(distance, 1)) * force * 68 - dy * swirl * 0.16;
            drawY += (dy / Math.max(distance, 1)) * force * 30 + dx * swirl * 0.08;
            glow += force * 0.18;
          }
          if (distance < 72 && (!nearest || distance < nearest.distance)) {
            nearest = { node, distance, x: drawX, y: drawY };
          }
        }

        for (const ripple of activeRipples) {
          const age = now - ripple.start;
          const radius = age * 0.42;
          const dx = node.x - ripple.x;
          const dy = node.y - ripple.y;
          const distance = Math.hypot(dx, dy);
          const band = Math.max(0, 1 - Math.abs(distance - radius) / 92);
          if (band > 0) {
            const force = band * (1 - age / 1600) * ripple.strength;
            drawX += (dx / Math.max(distance, 1)) * force;
            drawY += (dy / Math.max(distance, 1)) * force * 0.72;
            glow += band * 0.22;
          }
        }

        context2d.font = `${node.weight} ${node.size}px "Noto Sans KR", "Noto Sans SC", sans-serif`;
        context2d.fillStyle = `rgba(12, 31, 27, ${clamp(node.alpha + glow, 0.028, 0.24)})`;
        context2d.shadowColor = `rgba(28, 132, 99, ${clamp(glow, 0, 0.16)})`;
        context2d.shadowBlur = glow ? 14 : 0;
        context2d.fillText(node.word, drawX, drawY);
      }

      context2d.shadowBlur = 0;

      if (
        nearest &&
        pointer.active &&
        !mobile &&
        performance.now() - pointer.movedAt > 500
      ) {
        const nextKey = nearest.node.id;
        if (lastTooltipRef.current !== nextKey) {
          lastTooltipRef.current = nextKey;
          setTooltip({
            word: nearest.node.word,
            meaning: nearest.node.meaning,
            x: clamp(nearest.x + 14, 12, width - 220),
            y: clamp(nearest.y - 42, 12, height - 96),
          });
        }
      } else if (lastTooltipRef.current) {
        lastTooltipRef.current = null;
        setTooltip(null);
      }

      rafRef.current = window.requestAnimationFrame(draw);
    }

    syncReducedMotion();
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    mediaQuery.addEventListener("change", syncReducedMotion);
    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      mediaQuery.removeEventListener("change", syncReducedMotion);
    };
  }, [words]);

  return (
    <div className="word-waterfall">
      <canvas ref={canvasRef} aria-hidden="true" />
      {tooltip ? (
        <div
          className="word-waterfall-tooltip"
          style={{ transform: `translate3d(${tooltip.x}px, ${tooltip.y}px, 0)` }}
        >
          <strong>{tooltip.word}</strong>
          <span>{tooltip.meaning}</span>
        </div>
      ) : null}
    </div>
  );
}
