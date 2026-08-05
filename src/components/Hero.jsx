import { useState, useEffect, useRef } from "react";

// Desktop images (6)
const desktopImages = [
  "/hero-bg.png",
  "/hero-bg2.png",
  "/hero-bg3.png",
  "/hero-bg4.png",
  "/hero-bg5.png",
  "/hero-bg6.png",
];

// Mobile images (7)
const mobileImages = [
  "/hero-mbg.png",
  "/hero-mbg2.png",
  "/hero-mbg3.png",
  "/hero-mbg4.png",
  "/hero-mbg5.png",
  "/hero-mbg6.png",
  "/hero-mbg7.png",
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
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 9000); // 10 seconds
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
  }, [isMobile]); // restart when screen size changes

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startAutoSlide();
  }, [currentIndex]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden group"
      onMouseEnter={pauseAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* Background Image */}
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="absolute inset-0 w-full h-full object-cover fade-in select-none"
        draggable={false}
      />
    </section>
  );
}