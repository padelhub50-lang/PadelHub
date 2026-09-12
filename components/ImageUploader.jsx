"use client";

import { useRef, useState } from "react";
import { Plus, X, Loader2, ImageOff } from "lucide-react";

const MAX_IMAGES = 5;

export default function ImageUploader({ images = [], onChange }) {
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const slots = Array.from({ length: MAX_IMAGES }, (_, i) => images[i] || null);

  const handleFile = async (file) => {
    setError("");
    if (!file) return;
    setUploadingIndex(images.length);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Помилка завантаження");
      onChange([...images, data.url].slice(0, MAX_IMAGES));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingIndex(-1);
    }
  };

  const removeAt = (i) => {
    onChange(images.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="grid grid-cols-5 gap-3">
        {slots.map((src, i) => (
          <div key={i} className="aspect-square rounded-xl bg-bg3 border border-line relative overflow-hidden flex items-center justify-center">
            {src ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-bad"
                >
                  <X size={13} />
                </button>
              </>
            ) : uploadingIndex === i ? (
              <Loader2 size={20} className="text-cream/40 animate-spin" />
            ) : images.length < MAX_IMAGES && images.length === i ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-1 text-cream/40 hover:text-orange2"
              >
                <Plus size={20} />
                <span className="text-[10px]">Фото {i + 1}</span>
              </button>
            ) : (
              <ImageOff size={16} className="text-cream/15" />
            )}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <p className="text-xs text-cream/40 mt-2">До {MAX_IMAGES} фото на товар, до 4МБ кожне.</p>
      {error && <p className="text-xs text-bad mt-1">{error}</p>}
    </div>
  );
}
