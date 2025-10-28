"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

// --- Type for word data ---
interface WordDatum {
  text: string;
  size: number;
  count: number;
  x?: number;
  y?: number;
  rotate?: number;
}

// --- Minimal interface for d3-cloud layout ---
interface WordCloudLayout<T> {
  size: (size: [number, number]) => WordCloudLayout<T>;
  words: (words: T[]) => WordCloudLayout<T>;
  padding: (padding: number) => WordCloudLayout<T>;
  rotate: (rotate: () => number) => WordCloudLayout<T>;
  font: (font: string) => WordCloudLayout<T>;
  fontSize: (fontSize: (d: T) => number) => WordCloudLayout<T>;
  on: (event: "end", callback: (words: T[]) => void) => WordCloudLayout<T>;
  start: () => void;
}

// --- Props ---
interface WordCloudProps {
  text: string | string[];
  width?: number;
  height?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({
  text,
  width = 500,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!text || !svgRef.current) return;

    // --- Tokenize words ---
    const wordsArray =
      typeof text === "string"
        ? text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/gi, "")
            .split(/\s+/)
            .filter((w) => w.length > 1)
        : text.map((w) => w.toLowerCase());

    // --- Count occurrences ---
    const counts: Record<string, number> = {};
    for (const w of wordsArray) {
      counts[w] = (counts[w] || 0) + 1;
    }

    const data: WordDatum[] = Object.entries(counts).map(([word, count]) => ({
      text: word,
      size: 10 + count * 5,
      count,
    }));

    // --- Initialize layout ---
    const layout = cloud() as unknown as WordCloudLayout<WordDatum>;

    layout
      .size([width, height])
      .words(data)
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font("sans-serif")
      .fontSize((d) => d.size)
      .on("end", draw)
      .start();

    // --- Draw words ---
    function draw(words: WordDatum[]) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const g = svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const tooltip = d3.select(tooltipRef.current);

      g.selectAll("text")
        .data(words)
        .join("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d: WordDatum) =>
            `translate(${d.x ?? 0},${d.y ?? 0}) rotate(${d.rotate ?? 0})`,
        )
        .style("font-family", "sans-serif")
        .style("font-size", (d: WordDatum) => `${d.size}px`)
        .style("fill", (_: WordDatum, i: number) => color(String(i)))
        .style("cursor", "default")
        .text((d: WordDatum) => d.text)
        .on("mouseover", function (event: MouseEvent, d: WordDatum) {
          const target = event.currentTarget as SVGTextElement;
          const container = containerRef.current!;
          const rect = container.getBoundingClientRect();
          const x = event.clientX - rect.left; // clientX relative to container
          const y = event.clientY - rect.top; // clientY relative to container
          tooltip
            .style("opacity", 1)
            .html(`<strong>${d.text}</strong>: ${d.count}`)
            .style("left", x + "px")
            .style("top", y + "px");
          d3.select(target)
            .transition()
            .duration(150)
            .style("font-size", `${d.size * 1.2}px`);
        })
        .on("mousemove", (event: MouseEvent) => {
          const container = containerRef.current!;
          const rect = container.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          tooltip.style("left", x + "px").style("top", y + "px");
        })
        .on("mouseout", function (event: MouseEvent, d: WordDatum) {
          tooltip.style("position", "absolute").style("opacity", 0);
          const target = event.currentTarget as SVGTextElement;
          d3.select(target)
            .transition()
            .duration(150)
            .style("font-size", `${d.size}px`);
        });
    }
  }, [text, width, height]);

  return (
    <div ref={containerRef} className="relative">
      <svg ref={svgRef} className="w-full h-auto" />
      <div
        ref={tooltipRef}
        className="absolute bg-gray-800 text-white text-xs 
        px-2 py-1 rounded pointer-events-none 
        opacity-0 transition-opacity duration-200"
        style={{ position: "absolute", opacity: 0 }}
      />
    </div>
  );
};

export default WordCloud;
