"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type ImageViewerProps = {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function ImageViewer({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
    setPan({ x: 0, y: 0 });
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
    setPan({ x: 0, y: 0 });
  }, []);
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const goPrev = useCallback(() => {
    if (!hasMultiple || !onNavigate) return;
    const next = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(next);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [hasMultiple, currentIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (!hasMultiple || !onNavigate) return;
    const next = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(next);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [hasMultiple, currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <div
      className="image-viewer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        type="button"
        className="image-viewer-close"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <X size={28} />
      </button>

      <div className="image-viewer-toolbar">
        <button type="button" onClick={zoomOut} aria-label="Zoom out" disabled={zoom <= MIN_ZOOM}>
          <ZoomOut size={22} />
        </button>
        <span className="image-viewer-zoom-label">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={zoomIn} aria-label="Zoom in" disabled={zoom >= MAX_ZOOM}>
          <ZoomIn size={22} />
        </button>
        <button type="button" onClick={resetZoom} aria-label="Reset zoom">
          <RotateCcw size={20} />
        </button>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="image-viewer-nav image-viewer-prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            type="button"
            className="image-viewer-nav image-viewer-next"
            onClick={goNext}
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>
          <div className="image-viewer-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}

      <div
        className="image-viewer-content"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: zoom > 1 && isDragging ? "grabbing" : zoom > 1 ? "grab" : "default" }}
      >
        <div
          className="image-viewer-transform"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`View ${currentIndex + 1}`}
            className="image-viewer-img"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
