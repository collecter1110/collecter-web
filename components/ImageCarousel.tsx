"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  images: Array<{ image_url: string; sort_order: number }>;
  alt: string;
};

export default function ImageCarousel({ images, alt }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const width = el.clientWidth;
      if (width === 0) return;
      const index = Math.round(el.scrollLeft / width);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, idx) => (
          <div
            key={img.sort_order}
            className="relative shrink-0 w-full aspect-square snap-center bg-gray-100"
          >
            <Image
              src={img.image_url}
              alt={`${alt} ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
          {images.map((img, idx) => (
            <span
              key={img.sort_order}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
