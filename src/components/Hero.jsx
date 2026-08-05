import { useState, useEffect, useRef } from "react";

// Desktop images (WebP)
const desktopImages = [
  "/hero-bg.webp",
  "/hero-bg2.webp",
  "/hero-bg3.webp",
  "/hero-bg4.webp",
  "/hero-bg5.webp",
  "/hero-bg6.webp",
];

// Mobile images (WebP)
const mobileImages = [
  "/hero-mbg.webp",
  "/hero-mbg2.webp",
  "/hero-mbg3.webp",
  "/hero-mbg4.webp",
  "/hero-mbg5.webp",
  "/hero-mbg6.webp",
  "/hero-mbg7.webp",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);

  const images = isMobile ? mobileImages : desktopImages;
  const totalSlides = images.length;

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 5000);
  };

  const pauseAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMobile]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startAutoSlide();
  }, [currentIndex]);

  // Preload first image
  useEffect(() => {
    if (images[0]) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = images[0];
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [isMobile]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="absolute inset-0 w-full h-full object-cover fade-in select-none"
        draggable={false}
        loading={currentIndex === 0 ? "eager" : "lazy"}
      />
    </section>
  );
}