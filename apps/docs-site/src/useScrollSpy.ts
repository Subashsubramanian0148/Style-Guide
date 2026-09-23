import { useEffect, useRef, useState } from "react";

/** Sticky header + breathing room — section is "active" once its top crosses this line. */
const SCROLL_OFFSET = 120;
/** Ignore scroll-spy briefly after a hash click while smooth-scroll runs. */
const CLICK_LOCK_MS = 700;

function normalizeHash(hash: string) {
  if (!hash) return "";
  return hash.startsWith("#") ? hash : `#${hash}`;
}

/**
 * Order section ids by where they actually render top-to-bottom on screen —
 * NOT by raw DOM node order. The flat "All Components" page interleaves
 * sections A-Z across category boundaries purely via CSS flex `order`
 * (see DocsSection.tsx's `flatOrderForAnchor` + `display: contents`); the
 * underlying DOM order is whatever each page component happens to render
 * in, which is a different sequence entirely. Sorting by
 * `compareDocumentPosition` (raw DOM order) instead of rendered position
 * was a real bug: it made the scroll-spy walk sections in the wrong
 * sequence, so it could report an entirely different section as "active"
 * than the one actually on screen (reproduced: scrolled to "Buttons",
 * sidebar highlighted "Attachment"). Bounding-rect top reflects the final
 * layout after `order` is applied, so it's always the true visual sequence.
 */
function sortIdsByDocumentOrder(ids: string[]): string[] {
  return ids
    .map((id) => ({ id, el: document.getElementById(id) }))
    .filter((entry): entry is { id: string; el: HTMLElement } => entry.el !== null)
    .sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top)
    .map((entry) => entry.id);
}

function computeActiveHash(ids: string[]): string {
  if (!ids.length) return "";

  const scrollBottom = window.scrollY + window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollBottom >= docHeight - 8) {
    return `#${ids[ids.length - 1]}`;
  }

  const firstEl = document.getElementById(ids[0]);
  if (firstEl && firstEl.getBoundingClientRect().top > SCROLL_OFFSET) {
    return "";
  }

  let current = `#${ids[0]}`;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET) {
      current = `#${id}`;
    }
  }
  return current;
}

/** Tracks which `#section` anchor is in view — stable, document-order scroll spy. */
export function useScrollSpy(pathname: string, hashes: string[], locationHash: string) {
  const [activeHash, setActiveHash] = useState(() => normalizeHash(locationHash));
  const clickLockUntil = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const normalized = normalizeHash(locationHash);
    if (normalized && hashes.includes(normalized)) {
      setActiveHash(normalized);
      clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
    } else if (!normalized) {
      setActiveHash("");
    }
  }, [locationHash, pathname, hashes.join("|")]);

  useEffect(() => {
    const ids = sortIdsByDocumentOrder(
      hashes.map((h) => h.replace(/^#/, "")).filter(Boolean)
    );

    if (!ids.length) {
      setActiveHash("");
      return;
    }

    const update = () => {
      if (Date.now() < clickLockUntil.current) return;
      setActiveHash(computeActiveHash(ids));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    const timer = window.setTimeout(update, 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, hashes.join("|")]);

  return activeHash;
}
