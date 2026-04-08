import dynamic from "next/dynamic";
import { Container } from "@/components/layout/container";
import { ExchangeHero } from "@/features/intercambiar/components/exchange-hero";

const ExchangeForm = dynamic(
  () =>
    import("@/features/intercambiar/components/exchange-form").then(
      (mod) => mod.ExchangeForm,
    ),
  {
    loading: () => (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-lg bg-muted" />
          ))}
        </div>
        <div className="h-12 w-full rounded-full bg-muted" />
      </div>
    ),
  },
);

export default function ExchangePage() {
  return (
    <div className="overflow-x-clip">
      <Container className="py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          <ExchangeHero />
          <ExchangeForm />
        </div>
      </Container>
    </div>
  );
}
