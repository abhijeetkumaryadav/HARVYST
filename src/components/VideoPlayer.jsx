import React, { useRef, useEffect } from 'react';

export default function VideoPlayer({ src, className = '', controls = true, autoPlay = false }) {
  const videoRef = useRef(null);

  // Helper to convert any YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // youtu.be short link
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // youtube.com/watch?v=...
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const videoId = urlParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If it's already a valid embed, return as-is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return null;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Skip for YouTube (handled by iframe)
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      return;
    }

    // For MP4, WebM, etc.
    video.src = src;
    if (autoPlay) {
      video.play().catch(() => {});
    }
  }, [src, autoPlay]);

  // Check if the source is a YouTube URL
  const isYouTube = src && (src.includes('youtube.com') || src.includes('youtu.be'));

  if (isYouTube) {
    const embedUrl = getYouTubeEmbedUrl(src);
    if (!embedUrl) {
      return <div className="text-red-500 p-4">Invalid YouTube URL</div>;
    }
    return (
      <iframe
        className={className}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // For MP4, WebM, etc.
  return (
    <video
      ref={videoRef}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      playsInline
    />
  );
}