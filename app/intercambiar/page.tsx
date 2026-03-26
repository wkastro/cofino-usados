import { Container } from "@/components/layout/container";
import { ExchangeHero } from "@/features/intercambiar/components/exchange-hero";
import { ExchangeForm } from "@/features/intercambiar/components/exchange-form";

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
