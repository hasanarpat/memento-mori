"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = ["Tops", "Bottoms", "Outerwear", "Footwear"];
const SIZE_TABLE = [
  { size: "XS", chest: "86-89", waist: "66-69", hips: "89-92", inseam: "78" },
  { size: "S", chest: "90-93", waist: "70-73", hips: "93-96", inseam: "80" },
  { size: "M", chest: "94-97", waist: "74-77", hips: "97-100", inseam: "82" },
  { size: "L", chest: "98-101", waist: "78-81", hips: "101-104", inseam: "84" },
  { size: "XL", chest: "102-105", waist: "82-85", hips: "105-108", inseam: "86" },
  { size: "XXL", chest: "106-109", waist: "86-89", hips: "109-112", inseam: "88" },
];

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [metric, setMetric] = useState(true);

  return (
    <div className="size-guide-page">
      <h1 className="home-section-title">Size Guide</h1>
      <div className="size-guide-tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`size-guide-tab ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="size-guide-measure">
        <h2 className="home-new-arrivals-title">How to Measure</h2>
        <p className="size-guide-p">
          Measure over your undergarments. Keep the tape snug but not tight. Chest: around the fullest part. Waist: natural waist. Hips: fullest part. Inseam: inner leg from crotch to hem.
        </p>
      </section>

      <div className="size-guide-toggle">
        <button
          type="button"
          className={metric ? "active" : ""}
          onClick={() => setMetric(true)}
        >
          cm
        </button>
        <button
          type="button"
          className={!metric ? "active" : ""}
          onClick={() => setMetric(false)}
        >
          in
        </button>
      </div>

      <div className="size-guide-table-wrap">
        <table className="size-guide-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest</th>
              <th>Waist</th>
              <th>Hips</th>
              <th>Inseam</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_TABLE.map((row) => (
              <tr key={row.size}>
                <td><strong>{row.size}</strong></td>
                <td>{row.chest}</td>
                <td>{row.waist}</td>
                <td>{row.hips}</td>
                <td>{row.inseam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="size-guide-fit">
        <h2 className="home-new-arrivals-title">Fit Guide</h2>
        <div className="size-guide-fit-grid">
          <div className="size-guide-fit-card">
            <div className="size-guide-fit-icon" aria-hidden="true" />
            <h3 className="size-guide-fit-name">Slim Fit</h3>
            <p className="size-guide-fit-desc">
              Close to body, tailored silhouette. Best for layering or a sharp look.
            </p>
            <Link href="/collections?fit=slim" className="home-category-link">
              Shop Slim Fit
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <div className="size-guide-fit-card">
            <div className="size-guide-fit-icon" aria-hidden="true" />
            <h3 className="size-guide-fit-name">Regular Fit</h3>
            <p className="size-guide-fit-desc">
              Classic comfort with ease through chest and waist. Our most versatile fit.
            </p>
            <Link href="/collections?fit=regular" className="home-category-link">
              Shop Regular Fit
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <div className="size-guide-fit-card">
            <div className="size-guide-fit-icon" aria-hidden="true" />
            <h3 className="size-guide-fit-name">Oversized</h3>
            <p className="size-guide-fit-desc">
              Relaxed, roomy cut. Statement pieces for a bold, layered aesthetic.
            </p>
            <Link href="/collections?fit=oversized" className="home-category-link">
              Shop Oversized
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="size-guide-tips">
        <h2 className="home-new-arrivals-title">Sizing Tips</h2>
        <ul className="size-guide-list">
          <li>Between sizes? Size up for a relaxed fit.</li>
          <li>Our fabrics are pre-shrunk; order your true size.</li>
          <li>Check individual product descriptions for fit notes.</li>
        </ul>
      </section>

      <div className="size-guide-cta">
        <Link href="/contact" className="home-cta-outline">
          Still unsure? Contact us
        </Link>
      </div>
    </div>
  );
}
