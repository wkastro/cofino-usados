import { useState, useCallback, useEffect } from "react";

export type VideoSource =
  | { type: "youtube"; videoId: string }
  | { type: "local"; src: string };

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?\s]+)/,
  );
  return match?.[1] ?? url;
}

export function getVideoSource(url: string): VideoSource {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return { type: "youtube", videoId: extractYouTubeId(url) };
  }
  return { type: "local", src: url };
}

interface UseVideoPlayerReturn {
  isPlaying: boolean;
  play: () => void;
  stop: () => void;
}

export function useVideoPlayer(): UseVideoPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => setIsPlaying(true), []);
  const stop = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    return () => setIsPlaying(false);
  }, []);

  return { isPlaying, play, stop };
}
