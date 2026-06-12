import React from "react";

/**
 * Flag — renders a country flag using `flag-icons` CSS sprite (SVG).
 *
 * Renders identically on Windows/macOS/Linux/iOS/Android because it uses
 * bundled SVG flags (not OS emoji). Falls back to a discreet placeholder
 * if iso code is missing.
 *
 * @param {object} props
 * @param {string} props.iso - ISO-3166 alpha-2 (case-insensitive). e.g. "mx"
 * @param {"sm"|"md"|"lg"|"xl"|"2xl"} [props.size="md"]
 * @param {string} [props.className]
 * @param {string} [props.title]
 */
const Flag = ({ iso, size = "md", className = "", title }) => {
  const code = (iso || "").toLowerCase();
  const baseClass = `flag flag-${size} fi fi-${code} ${className}`.trim();
  if (!code) {
    return (
      <span
        className={`flag flag-${size} ${className} bg-zinc-800`}
        aria-hidden="true"
        title={title || "?"}
      />
    );
  }
  return (
    <span
      className={baseClass}
      role="img"
      aria-label={title || code.toUpperCase()}
      title={title || code.toUpperCase()}
    />
  );
};

export default Flag;
