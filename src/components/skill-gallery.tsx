"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string; width: number; height: number };

export function SkillGallery({
  photos,
  label,
}: {
  photos: Photo[];
  label: string;
}) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  return (
    <>
      <section className="skill-gallery" aria-label={label}>
        {photos.map((photo) => (
          <figure key={photo.src}>
            <button
              type="button"
              className="skill-gallery-trigger"
              onClick={() => setSelected(photo)}
              aria-label={`Expand photo: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 767px) 44vw, 20vw"
              />
            </button>
            <figcaption>{photo.alt}</figcaption>
          </figure>
        ))}
      </section>
      <dialog
        ref={dialogRef}
        className="skill-photo-dialog"
        aria-label="Expanded photo"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {selected ? (
          <div className="skill-photo-dialog-content">
            <button
              type="button"
              className="skill-photo-close"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close expanded photo"
              autoFocus
            >
              ×
            </button>
            <Image
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              sizes="90vw"
            />
            <p>{selected.alt}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
