"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export type HeroSlide = {
  image: string;
  title: string;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

const INTERVAL = 5000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (slides.length <= 1) return;
    timer.current = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      INTERVAL
    );
  }, [slides.length]);

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  if (slides.length === 0) return null;

  return (
    <section className="slider-container" aria-roledescription="carousel">
      {slides.map((slide, i) => (
        <div key={i} className={`slide ${i === current ? "active" : ""}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover animate-kenburns"
          />
          <div className="relative z-20 h-full flex items-center max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
            <div className="max-w-2xl slide-content-anim">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg lg:text-xl text-white/90 mb-10">
                  {slide.subtitle}
                </p>
              )}
              {slide.ctaLabel && (
                <Link
                  href={slide.ctaHref || "/san-pham"}
                  className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform"
                >
                  {slide.ctaLabel} <Icon name="arrow_forward" />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => {
              go(current - 1);
              restart();
            }}
            className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 z-30 size-12 lg:size-14 rounded-full border border-white/30 bg-black/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all"
            aria-label="Slide trước"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            onClick={() => {
              go(current + 1);
              restart();
            }}
            className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 z-30 size-12 lg:size-14 rounded-full border border-white/30 bg-black/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all"
            aria-label="Slide sau"
          >
            <Icon name="chevron_right" />
          </button>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  go(i);
                  restart();
                }}
                className={`pagination-dot h-2 w-2 rounded-full bg-white/40 ${
                  i === current ? "active" : ""
                }`}
                aria-label={`Đến slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
