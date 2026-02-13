"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

function getTouchDistance(t1: Touch, t2: Touch): number {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

export type ViewerSlideCaption = {
  reviewText?: string;
  reviewAuthor?: string;
  reviewRating?: number;
};

type ImageViewerProps = {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  /** Optional: per-image captions (e.g. review text). Same length as images. */
  captions?: (ViewerSlideCaption | null)[];
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function ImageViewer({
  images,
  currentIndex,
  onClose,
  onNavigate,
  captions,
}: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const touchSwipeStartX = useRef<number>(0);
  const touchPinchStart = useRef<{ distance: number; zoom: number } | null>(null);
  const touchPanStart = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  const touchWasPinch = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;
  const currentCaption = captions?.[currentIndex];

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
    if (images.length === 0 || !onNavigate) return;
    const next = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(next);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (images.length === 0 || !onNavigate) return;
    const next = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(next);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentIndex, images.length, onNavigate]);

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

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) e.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

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

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        touchWasPinch.current = true;
        touchPanStart.current = null;
        touchPinchStart.current = {
          distance: getTouchDistance(e.touches[0], e.touches[1]),
          zoom,
        };
      } else if (e.touches.length === 1) {
        touchWasPinch.current = false;
        touchSwipeStartX.current = e.touches[0].clientX;
        touchPinchStart.current = null;
        if (zoom > 1) {
          touchPanStart.current = {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
            panX: pan.x,
            panY: pan.y,
          };
        } else {
          touchPanStart.current = null;
        }
      }
    },
    [zoom, pan.x, pan.y]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && touchPinchStart.current) {
        e.preventDefault();
        const distance = getTouchDistance(e.touches[0], e.touches[1]);
        const scale = distance / touchPinchStart.current.distance;
        setZoom((z) => {
          const next = touchPinchStart.current!.zoom * scale;
          return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
        });
      } else if (
        e.touches.length === 1 &&
        !touchWasPinch.current &&
        touchPanStart.current
      ) {
        const t = e.touches[0];
        setPan({
          x: touchPanStart.current.panX + (t.clientX - touchPanStart.current.clientX),
          y: touchPanStart.current.panY + (t.clientY - touchPanStart.current.clientY),
        });
      }
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) return;
      touchPanStart.current = null;
      if (touchWasPinch.current) {
        touchPinchStart.current = null;
        touchWasPinch.current = false;
        return;
      }
      if (e.changedTouches.length === 0 || !hasMultiple || !onNavigate || zoom > 1) return;
      const deltaX = e.changedTouches[0].clientX - touchSwipeStartX.current;
      if (deltaX > SWIPE_THRESHOLD) goPrev();
      else if (deltaX < -SWIPE_THRESHOLD) goNext();
    },
    [hasMultiple, onNavigate, goPrev, goNext, zoom]
  );

  const viewerContent = (
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

      {currentCaption?.reviewText && (
        <div className="image-viewer-caption" aria-live="polite">
          <p className="image-viewer-caption-text">{currentCaption.reviewText}</p>
          {(currentCaption.reviewAuthor != null || currentCaption.reviewRating != null) && (
            <span className="image-viewer-caption-meta">
              {currentCaption.reviewAuthor != null && currentCaption.reviewAuthor}
              {currentCaption.reviewRating != null && ` · ${currentCaption.reviewRating}/5`}
            </span>
          )}
        </div>
      )}

      <div
        ref={contentRef}
        className="image-viewer-content"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: zoom > 1 && isDragging ? "grabbing" : zoom > 1 ? "grab" : "default",
          touchAction: zoom > 1 ? "none" : "pan-y",
        }}
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

  if (typeof document === "undefined") return null;
  return createPortal(viewerContent, document.body);
}
