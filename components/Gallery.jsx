"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

export default function Gallery({ images = [], alt }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const pics = images.length ? images : [null];
  const hasMultiple = pics.length > 1;

  const go = (dir) => setActive((i) => (i + dir + pics.length) % pics.length);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, pics.length]);

  return (
    <div>
      <div className="card overflow-hidden aspect-square relative mb-3 p-4 group">
        <AnimatePresence mode="wait">
          {pics[active] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              key={active}
              src={pics[active]}
              alt={alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-contain cursor-zoom-in"
              onClick={() => setLightbox(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cream/30">
              <ImageOff size={48} />
            </div>
          )}
        </AnimatePresence>

        {pics[active] && (
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Збільшити"
          >
            <ZoomIn size={17} />
          </button>
        )}

        {hasMultiple && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Попереднє фото"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Наступне фото"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-5 gap-2">
          {pics.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors p-1 ${
                active === i ? "border-orange" : "border-transparent"
              } bg-bg3`}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-contain" />
              ) : null}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && pics[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center"
            onClick={() => {
              setLightbox(false);
              setZoomed(false);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(false);
                setZoomed(false);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              aria-label="Закрити"
            >
              <X size={20} />
            </button>

            {hasMultiple && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomed(false);
                    go(-1);
                  }}
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  aria-label="Попереднє фото"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomed(false);
                    go(1);
                  }}
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  aria-label="Наступне фото"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <div className="w-full h-full flex items-center justify-center overflow-hidden px-14 py-14">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pics[active]}
                alt={alt}
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed((z) => !z);
                }}
                className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                  zoomed ? "scale-[1.9] cursor-zoom-out" : "cursor-zoom-in"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
