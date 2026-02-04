"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import { lookbookItems } from "../data/shop";

export default function LookbookPage() {
  const [seasonFilter, setSeasonFilter] = useState("all");

  const filteredLookbook = lookbookItems.filter((item) => {
    if (seasonFilter === "all") return true;
    if (seasonFilter === "spring-summer") return item.year.includes("S/S");
    if (seasonFilter === "fall-winter") return item.year.includes("F/W");
    if (seasonFilter === "archive") return item.year === "Archive";
    return true;
  });

  return (
    <div className="lookbook-page">
      <h2 className="section-title">Seasonal Lookbook</h2>
      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${seasonFilter === "all" ? "active" : ""}`}
          onClick={() => setSeasonFilter("all")}
        >
          All Seasons
        </button>
        <button
          type="button"
          className={`filter-tab ${seasonFilter === "spring-summer" ? "active" : ""}`}
          onClick={() => setSeasonFilter("spring-summer")}
        >
          Spring/Summer
        </button>
        <button
          type="button"
          className={`filter-tab ${seasonFilter === "fall-winter" ? "active" : ""}`}
          onClick={() => setSeasonFilter("fall-winter")}
        >
          Fall/Winter
        </button>
        <button
          type="button"
          className={`filter-tab ${seasonFilter === "archive" ? "active" : ""}`}
          onClick={() => setSeasonFilter("archive")}
        >
          Archive
        </button>
      </div>
      <div className="masonry-grid">
        {filteredLookbook.map((item) => (
          <div key={item.id} className={`lookbook-item ${item.size}`}>
            <div
              className="lookbook-image"
              style={{
                height:
                  item.size === "large"
                    ? "500px"
                    : item.size === "medium"
                      ? "400px"
                      : "300px",
              }}
            >
              <Moon className="lookbook-placeholder" />
              <div className="lookbook-overlay">
                <h3 className="lookbook-season">{item.season}</h3>
                <p className="lookbook-year">{item.year}</p>
                <p className="lookbook-category">{item.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
