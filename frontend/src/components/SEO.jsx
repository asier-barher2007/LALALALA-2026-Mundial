import React, { useEffect } from "react";

/**
 * Sets document title and meta description for SEO.
 * Lightweight alternative to react-helmet (we're on CRA).
 */
const SEO = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} · WorldCup Nexus`;
    }
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
  return null;
};

export default SEO;
