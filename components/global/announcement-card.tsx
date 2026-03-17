import Image from "next/image";
import Link from "next/link";

export interface AnnouncementCardProps {
  image: string;
  alt: string;
  title: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

export function AnnouncementCard({
  image,
  alt,
  title,
  description,
  buttonText,
  href = "#",
}: AnnouncementCardProps) {
  return (
    <article className="relative w-full overflow-hidden rounded-2xl aspect-video">
      {/* Background image */}
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8 md:p-10 max-w-lg">
        <h3 className="text-fs-lg font-semibold text-white leading-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-white/80 leading-snug">
            {description}
          </p>
        )}
        {buttonText && (
          <div className="mt-5">
            <Link
              href={href}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 active:scale-95"
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
