import { Suspense }             from "react"
import type { Metadata }        from "next"
import Hero                     from "@/components/sections/home/hero"
import AnnouncementGrid         from "@/components/sections/home/announcement-grid"
import WrapperMarquee           from "@/components/sections/home/wrapper-marquee"
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content"
import { HomeRecommendations }  from "@/features/recommendations/components/home-recommendations"
import { VehicleCardSkeletonGrid }  from "@/components/global/vehicle-card-skeleton"
import { FilterLoadingProvider }    from "@/features/filters/context/filter-loading-context"
import { getPageContent }           from "@/app/actions/page-content.cached"
import { heroBlock }                from "@/features/cms/blocks/inicio/hero.block"
import { marqueeBlock }             from "@/features/cms/blocks/inicio/marquee.block"
import { announcementsBlock }       from "@/features/cms/blocks/inicio/announcements.block"
import { SEO_BLOCK_KEY }            from "@/features/cms/types/block"
import type { HeroContent }         from "@/features/cms/blocks/inicio/hero.block"
import type { MarqueeContent }      from "@/features/cms/blocks/inicio/marquee.block"
import type { AnnouncementsContent } from "@/features/cms/blocks/inicio/announcements.block"
import type { SearchParams }        from "@/types/filters/filters"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("inicio")
  const seo = content[SEO_BLOCK_KEY] as Record<string, string> | undefined
  return {
    title:       seo?.title,
    description: seo?.description,
    openGraph: {
      title:       seo?.ogTitle,
      description: seo?.ogDescription,
      images:      seo?.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: seo?.canonical ? { canonical: seo.canonical } : undefined,
  }
}

interface HomeProps {
  searchParams: Promise<SearchParams>
}

export default async function Home({ searchParams }: HomeProps): Promise<React.ReactElement> {
  const content = await getPageContent("inicio")

  const heroContent          = (content[heroBlock.key]          ?? heroBlock.defaultValue)          as unknown as HeroContent
  const marqueeContent       = (content[marqueeBlock.key]       ?? marqueeBlock.defaultValue)       as unknown as MarqueeContent
  const announcementsContent = (content[announcementsBlock.key] ?? announcementsBlock.defaultValue) as unknown as AnnouncementsContent

  return (
    <FilterLoadingProvider>
      <Hero content={heroContent}>
        <Suspense>
          <HomeSearchBarContent searchParams={searchParams} className="absolute bottom-6 left-0 right-0 z-30" />
        </Suspense>
      </Hero>

      <Suspense fallback={<VehicleCardSkeletonGrid count={6} />}>
        <HomeRecommendations searchParams={searchParams} />
      </Suspense>

      <WrapperMarquee content={marqueeContent} />
      <AnnouncementGrid content={announcementsContent} />
    </FilterLoadingProvider>
  )
}
