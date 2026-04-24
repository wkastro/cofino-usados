"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getVideoSource } from "../hooks/useVideoPlayer";
import type { VideoSource } from "../hooks/useVideoPlayer";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          videoid?: string;
          videotitle?: string;
          params?: string;
          posterquality?: string;
          "no-cookie"?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

interface VideoShowcaseProps {
  videoUrl: string;
  coverImage: string;
  title: string;
  subtitle?: string;
}

function VideoOverlay({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8 lg:p-10 pointer-events-none">
      <div className="max-w-sm lg:max-w-md">
        <h3 className="text-fs-lg font-semibold text-white leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-2 text-white/80 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function LocalVideoPlayer({ src, coverImage, title, subtitle }: { src: string; coverImage: string; title: string; subtitle?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-brand-dark aspect-video">
      {isPlaying ? (
        <video
          src={src}
          controls
          autoPlay
          className="absolute inset-0 size-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />
      ) : (
        <>
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 size-full object-cover brightness-[0.6]"
          />
          <VideoOverlay title={title} subtitle={subtitle} />
          <button
            onClick={() => setIsPlaying(true)}
            aria-label="Reproducir video"
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
          >
            <div className="flex size-16 sm:size-20 lg:size-24 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95">
              <svg viewBox="0 0 24 24" className="size-7 sm:size-9 lg:size-10 fill-white ml-1" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </>
      )}
    </section>
  );
}

function stopLiteYoutube(el: HTMLElement | null) {
  if (!el?.shadowRoot) return;
  el.shadowRoot.querySelector("iframe")?.remove();
  el.shadowRoot.querySelector("#frame")?.classList.remove("activated");
}

function YouTubeShowcase({ videoId, title }: { videoId: string; title: string; subtitle?: string }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    import("@justinribeiro/lite-youtube");
  }, []);

  useEffect(() => {
    const el = ref.current;
    return () => stopLiteYoutube(el);
  }, [pathname]);

  return (
    <section className="w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-brand-dark aspect-video">
      <lite-youtube
        ref={ref}
        videoid={videoId}
        videotitle={title}
        posterquality="maxresdefault"
        params="rel=0"
        no-cookie
        style={{ borderRadius: "inherit", width: "100%", height: "100%" }}
      />
    </section>
  );
}

export function VideoShowcase({
  videoUrl,
  coverImage,
  title,
  subtitle,
}: VideoShowcaseProps) {
  const source: VideoSource = getVideoSource(videoUrl);

  if (source.type === "youtube") {
    return <YouTubeShowcase videoId={source.videoId} title={title} subtitle={subtitle} />;
  }

  return <LocalVideoPlayer src={source.src} coverImage={coverImage} title={title} subtitle={subtitle} />;
}
