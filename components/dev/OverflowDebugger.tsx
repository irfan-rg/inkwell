"use client";

import { useEffect } from "react";

function isVisible(el: HTMLElement) {
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  return el.offsetWidth > 0 || el.offsetHeight > 0;
}

export function OverflowDebugger() {
  useEffect(() => {
    const outlined = new Set<HTMLElement>();
    let lastSignature = "";

    const cssEscape = (value: string) => {
      // Best-effort escape without relying on CSS.escape in older engines
      return value.replace(/[^a-zA-Z0-9_-]/g, (m) => `\\${m}`);
    };

    const getSelector = (el: HTMLElement) => {
      const parts: string[] = [];
      let node: HTMLElement | null = el;
      let depth = 0;
      while (node && node !== document.body && depth < 6) {
        const tag = node.tagName.toLowerCase();
        const id = node.id ? `#${cssEscape(node.id)}` : "";
        const classes = node.className
          ? String(node.className)
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 3)
              .map((c) => `.${cssEscape(c)}`)
              .join("")
          : "";
        parts.unshift(`${tag}${id}${classes}`);
        node = node.parentElement;
        depth += 1;
      }
      return parts.join(" > ");
    };

    const clearOutlines = () => {
      outlined.forEach((el) => {
        el.style.outline = "";
        el.style.outlineOffset = "";
      });
      outlined.clear();
    };

    const check = () => {
      clearOutlines();

      const root = document.documentElement;
      const viewportWidth = root.clientWidth;
      const scrollWidth = root.scrollWidth;

      if (scrollWidth <= viewportWidth + 1) return;

      const offenders: Array<{ el: HTMLElement; left: number; right: number; width: number }> = [];

      const all = Array.from(document.body.querySelectorAll<HTMLElement>("*") as NodeListOf<HTMLElement>);
      for (const el of all) {
        if (!isVisible(el)) continue;

        const rect = el.getBoundingClientRect();
        if (rect.width <= 0) continue;

        // Allow tiny rounding differences
        const leftOverflow = rect.left < -1;
        const rightOverflow = rect.right > viewportWidth + 1;
        if (!leftOverflow && !rightOverflow) continue;

        offenders.push({ el, left: rect.left, right: rect.right, width: rect.width });
      }

      offenders.sort((a, b) => b.width - a.width);

      const signature = `${scrollWidth}|${viewportWidth}|${offenders
        .slice(0, 6)
        .map((o) => getSelector(o.el))
        .join("||")}`;
      if (signature === lastSignature) return;
      lastSignature = signature;

      // Outline top offenders for quick visual identification
      for (const { el } of offenders.slice(0, 15)) {
        el.style.outline = "2px solid hsl(var(--destructive))";
        el.style.outlineOffset = "2px";
        outlined.add(el);
      }

      // Console output for precise inspection
      console.groupCollapsed(
        `[OverflowDebugger] Horizontal overflow: scrollWidth=${scrollWidth}px > viewport=${viewportWidth}px. Offenders: ${offenders.length}`
      );
      for (const o of offenders.slice(0, 30)) {
        console.log(o.el, {
          selector: getSelector(o.el),
          left: o.left,
          right: o.right,
          width: o.width,
        });
      }
      console.groupEnd();
    };

    const rafCheck = () => window.requestAnimationFrame(check);

    window.addEventListener("resize", rafCheck);
    window.addEventListener("orientationchange", rafCheck);

    // Run after initial layout + fonts
    const t1 = window.setTimeout(rafCheck, 0);
    const t2 = window.setTimeout(rafCheck, 250);
    const t3 = window.setTimeout(rafCheck, 1000);

    return () => {
      window.removeEventListener("resize", rafCheck);
      window.removeEventListener("orientationchange", rafCheck);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      clearOutlines();
    };
  }, []);

  return null;
}
