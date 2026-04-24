export type VideoSource =
  | { type: "youtube"; videoId: string }
  | { type: "local"; src: string };

const YOUTUBE_ID_REGEX =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?\s]+)/;

function extractYouTubeId(url: string): string {
  const match = url.match(YOUTUBE_ID_REGEX);
  return match?.[1] ?? url;
}

export function getVideoSource(url: string): VideoSource {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return { type: "youtube", videoId: extractYouTubeId(url) };
  }
  return { type: "local", src: url };
}
