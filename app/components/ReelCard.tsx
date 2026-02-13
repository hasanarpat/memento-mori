'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, ExternalLink } from 'lucide-react';

export type ReelCardProps = {
  videoSrc: string | null;
  thumbSrc: string | null;
  title: string;
  description?: string | null;
  campaignTitle?: string | null;
  campaignSubline?: string | null;
  href: string | null;
  linkLabel: string;
  videoUrl: string | null;
  isExternalHref: boolean;
};

export default function ReelCard({
  videoSrc,
  thumbSrc,
  title,
  description,
  campaignTitle,
  campaignSubline,
  href,
  linkLabel,
  videoUrl,
  isExternalHref,
}: ReelCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !videoSrc) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setIsInView(e?.isIntersecting ?? false);
      },
      { rootMargin: '20%', threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  return (
    <article ref={cardRef} className="reel-card">
      <div className="reel-card__media">
        {videoSrc ? (
          <>
            <video
              ref={videoRef}
              className="reel-card__video"
              src={videoSrc}
              poster={thumbSrc ?? undefined}
              muted
              loop
              playsInline
              aria-hidden
            />
            {!isInView && thumbSrc && (
              <Image
                src={thumbSrc}
                alt=""
                fill
                className="reel-card__poster"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
            )}
          </>
        ) : (
          thumbSrc && (
            <Image
              src={thumbSrc}
              alt=""
              fill
              className="reel-card__thumb"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          )
        )}
        <div className="reel-card__shade" />
        {videoUrl && !videoSrc && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reel-card__play-btn"
            aria-label="Videoyu izle"
          >
            <Play size={48} fill="currentColor" strokeWidth={0} />
          </a>
        )}
      </div>
      <div className="reel-card__content">
        {campaignTitle && (
          <div className="reel-card__campaign">
            <span className="reel-card__campaign-title">{campaignTitle}</span>
            {campaignSubline && (
              <span className="reel-card__campaign-sub">{campaignSubline}</span>
            )}
          </div>
        )}
        <h3 className="reel-card__title">{title}</h3>
        {description && <p className="reel-card__desc">{description}</p>}
        <div className="reel-card__actions">
          {href &&
            (isExternalHref ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="reel-card__btn reel-card__btn--primary"
              >
                {linkLabel}
                <ExternalLink size={18} />
              </a>
            ) : (
              <Link href={href} className="reel-card__btn reel-card__btn--primary">
                {linkLabel}
                <ArrowRight size={18} />
              </Link>
            ))}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="reel-card__btn reel-card__btn--secondary"
            >
              Videoyu İzle
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
