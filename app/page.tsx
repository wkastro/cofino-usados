import { Suspense } from "react";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { HomeContent } from "./home-content";

interface HomeProps {
  searchParams: Promise<{ marca?: string; categoria?: string; transmision?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  return (
    <>
      <Suspense>
        <HomeContent searchParams={searchParams} />
      </Suspense>
      <WrapperMarquee />
      <AnnouncementGrid />
    </>
  );
}
