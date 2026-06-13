import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../../components/Navbar";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";

const PHOTOS = [
  // Interiors
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=85&auto=format&fit=crop", label: "Interior", caption: "King West, Toronto" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=85&auto=format&fit=crop", label: "Interior", caption: "Every chair, ready" },
  { src: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=900&q=85&auto=format&fit=crop", label: "Interior", caption: "Clean space, clear mind" },
  // Craft
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=85&auto=format&fit=crop", label: "Craft", caption: "Fade in progress" },
  { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=85&auto=format&fit=crop", label: "Craft", caption: "Precision beard work" },
  { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=85&auto=format&fit=crop", label: "Craft", caption: "Clean edge lines" },
  { src: "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=900&q=85&auto=format&fit=crop", label: "Craft", caption: "Straight razor finish" },
  // People
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85&auto=format&fit=crop", label: "Team", caption: "Marcus — Toronto" },
  { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85&auto=format&fit=crop", label: "Team", caption: "Jordan — Toronto" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=85&auto=format&fit=crop", label: "Team", caption: "Dev — Toronto" },
  { src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&q=85&auto=format&fit=crop", label: "Team", caption: "Antoine — Montreal" },
  { src: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=900&q=85&auto=format&fit=crop", label: "Team", caption: "Karim — Montreal" },
];

const FILTERS = ["All", "Interior", "Craft", "Team"];

function PhotoCard({ photo, index, onClick }) {
  return (
    <motion.button
      className="relative overflow-hidden group w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
      onClick={() => onClick(photo)}
    >
      <div className="overflow-hidden">
        <img
          src={photo.src}
          alt={photo.caption}
          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ aspectRatio: index % 5 === 0 ? "3/4" : index % 3 === 0 ? "4/3" : "1/1" }}
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-shop-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="eyebrow text-shop-gold text-[10px]">{photo.label}</span>
        <p className="text-shop-text text-sm mt-0.5">{photo.caption}</p>
      </div>
    </motion.button>
  );
}

function Lightbox({ photo, onClose, onPrev, onNext }) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-shop-bg/95 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 max-w-4xl w-full px-4"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo.src.replace("w=900", "w=1400")}
              alt={photo.caption}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="eyebrow text-shop-gold">{photo.label}</span>
                <p className="text-shop-text text-sm mt-1">{photo.caption}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={onPrev} className="text-shop-muted hover:text-shop-gold transition-colors text-xl px-3">←</button>
                <button onClick={onNext} className="text-shop-muted hover:text-shop-gold transition-colors text-xl px-3">→</button>
              </div>
            </div>
          </motion.div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-shop-muted hover:text-shop-gold transition-colors text-2xl z-10"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Gallery() {
  const headerRef = useRef(null);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered = filter === "All" ? PHOTOS : PHOTOS.filter((p) => p.label === filter);
  const lbIndex = lightbox ? filtered.findIndex((p) => p === lightbox) : -1;

  useGSAP(() => {
    gsap.fromTo(
      headerRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "cubic-bezier(0.22,0.61,0.36,1)", delay: 0.45 }
    );
  }, { scope: headerRef });

  return (
    <div className="min-h-screen bg-shop-bg">
      <Navbar />

      {/* Header */}
      <div ref={headerRef} className="pt-36 pb-12 px-6 md:px-[5%]">
        <span className="eyebrow opacity-0">Portfolio</span>
        <span className="gold-rule mt-3 opacity-0" />
        <h1 className="font-playfair text-5xl md:text-7xl font-bold text-shop-text leading-tight mb-4 opacity-0">
          The work.
        </h1>
        <p className="text-shop-muted text-sm max-w-sm leading-relaxed opacity-0">
          Every cut. Every space. Every person behind the chair.
        </p>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap mt-10 opacity-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={"px-5 py-2 text-xs tracking-widest uppercase transition-all duration-200 border " + (
                filter === f
                  ? "bg-shop-gold text-shop-bg border-shop-gold font-semibold"
                  : "border-shop-border text-shop-muted hover:border-shop-muted hover:text-shop-text"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="px-6 md:px-[5%] pb-24">
        <motion.div
          key={filter}
          className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filtered.map((photo, i) => (
            <div key={photo.src} className="break-inside-avoid mb-3">
              <PhotoCard photo={photo} index={i} onClick={setLightbox} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        photo={lightbox}
        onClose={() => setLightbox(null)}
        onPrev={() => lbIndex > 0 && setLightbox(filtered[lbIndex - 1])}
        onNext={() => lbIndex < filtered.length - 1 && setLightbox(filtered[lbIndex + 1])}
      />
    </div>
  );
}
