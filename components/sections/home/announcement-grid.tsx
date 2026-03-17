import { AnnouncementCard } from "@/components/global/announcement-card";

export default function AnnouncementGrid() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-7xl mx-auto w-full">
        <AnnouncementCard
          image="/anuncio_toyota.jpg"
          alt="Toyota SUV en campo abierto"
          title="Historias que mueven"
          description="Conoce a quienes ya confiaron en Cofiño Usados y encontraron su vehículo ideal."
          buttonText="Testimonios"
          href="/testimonios"
        />
        <AnnouncementCard
          image="/anuncio_vende.jpg"
          alt="Vende tu vehículo con Cofiño Usados"
          title="¿Querés vender tu vehículo?"
          description="Te ayudamos a publicar, negociar y cerrar la venta de forma rápida y segura."
          buttonText="Más información"
          href="/vender"
        />
      </section>
  );
}