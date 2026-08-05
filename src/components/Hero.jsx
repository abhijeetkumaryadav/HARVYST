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
  const [prevIndex, setPrevIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const [prevOpacity, setPrevOpacity] = useState(0);
  const intervalRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

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

  // Cross‑fade transition logic
  const transitionTo = (newIndex) => {
    setPrevIndex(currentIndex);
    setCurrentIndex(newIndex);
    setPrevOpacity(1);
    setCurrentOpacity(0);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      setPrevOpacity(0);
      setCurrentOpacity(1);
    }, 80);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % totalSlides;
      // Schedule cross‑fade after state update
      setTimeout(() => {
        setPrevIndex(prev);
        setPrevOpacity(1);
        setCurrentOpacity(0);
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = setTimeout(() => {
          setPrevOpacity(0);
          setCurrentOpacity(1);
        }, 80);
      }, 0);
      return next;
    });
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
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [isMobile]);

  // Reset cross‑fade when switching between mobile/desktop
  useEffect(() => {
    setCurrentOpacity(1);
    setPrevOpacity(0);
    setPrevIndex(currentIndex);
  }, [isMobile]);

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
    <section
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={pauseAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* Previous Image (fading out) */}
      <img
        src={images[prevIndex]}
        alt={`Slide ${prevIndex + 1}`}
        className="absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-1000"
        style={{ opacity: prevOpacity }}
        draggable={false}
      />
      {/* Current Image (fading in) */}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-1000"
        style={{ opacity: currentOpacity }}
        draggable={false}
        loading="eager"
      />
    </section>
  );
}