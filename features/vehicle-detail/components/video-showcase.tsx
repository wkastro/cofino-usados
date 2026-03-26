"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useVideoPlayer, getVideoSource } from "../hooks/useVideoPlayer";
import type { VideoSource } from "../hooks/useVideoPlayer";

interface VideoShowcaseProps {
  videoUrl: string;
  coverImage: string;
  title: string;
  subtitle?: string;
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-8 lg:size-10"
      aria-hidden="true"
    >
      <rect width="28" height="20" rx="5" fill="#FF0000" />
      <path d="M18 10L11.5 13.897V6.103L18 10Z" fill="white" />
    </svg>
  );
}

function VideoOverlay({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
      <div className="max-w-sm lg:max-w-md">
        <h3 className="text-fs-lg font-semibold text-white leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-2 text-white/80 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Reproducir video"
      className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
    >
      <div className="flex size-16 sm:size-20 lg:size-24 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95">
        <Play className="size-7 sm:size-9 lg:size-10 fill-white text-white ml-1" />
      </div>
    </button>
  );
}

function ProgressBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
      <div className="h-full w-1/3 bg-red-600 rounded-r-full" />
    </div>
  );
}

function YouTubePlayer({ videoId }: { videoId: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    return () => {
      iframeRef.current?.setAttribute("src", "");
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
      title="Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 size-full"
    />
  );
}

function LocalVideoPlayer({ src, onClose }: { src: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      videoRef.current?.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      autoPlay
      className="absolute inset-0 size-full object-cover"
      onEnded={onClose}
    />
  );
}

function VideoPlayer({ source, onClose }: { source: VideoSource; onClose: () => void }) {
  if (source.type === "youtube") {
    return <YouTubePlayer videoId={source.videoId} />;
  }

  return <LocalVideoPlayer src={source.src} onClose={onClose} />;
}

export function VideoShowcase({
  videoUrl,
  coverImage,
  title,
  subtitle,
}: VideoShowcaseProps) {
  const { isPlaying, play, stop } = useVideoPlayer();
  const source: VideoSource = getVideoSource(videoUrl);

  return (
    <section className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-brand-dark aspect-video">
      {isPlaying ? (
        <VideoPlayer source={source} onClose={stop} />
      ) : (
        <>
          {/* Cover image */}
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover brightness-[0.6]"
            priority
          />

          {/* YouTube badge */}
          <div className="absolute top-4 left-4 z-20 lg:top-6 lg:left-6">
            <YouTubeIcon />
          </div>

          {/* Text overlay */}
          <VideoOverlay title={title} subtitle={subtitle} />

          {/* Play button */}
          <PlayButton onClick={play} />

          {/* Progress bar decoration */}
          <ProgressBar />
        </>
      )}
    </section>
  );
}
