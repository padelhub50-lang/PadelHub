"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff } from "lucide-react";

export default function Gallery({ images = [], alt }) {
  const [active, setActive] = useState(0);
  const pics = images.length ? images : [null];

  return (
    <div>
      <div className="card overflow-hidden aspect-square relative mb-3">
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
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cream/30">
              <ImageOff size={48} />
            </div>
          )}
        </AnimatePresence>
      </div>
      {pics.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {pics.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                active === i ? "border-orange" : "border-transparent"
              } bg-bg3`}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
