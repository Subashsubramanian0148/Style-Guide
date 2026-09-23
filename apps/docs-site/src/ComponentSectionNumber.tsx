import React from "react";
import { sectionIdForAnchor } from "./navConfig";

export function ComponentSectionNumber({ anchorId }: { anchorId: string }) {
  const id = sectionIdForAnchor(anchorId);
  if (!id) return null;

  return (
    <div className="docs-section__number">
      {id}
    </div>
  );
}
