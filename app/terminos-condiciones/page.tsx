import Image from "next/image"
import { Logo } from "@/components/global/logo"
import { Container } from "@/components/layout/container"

export default function TerminosCondicionesPage() {
    return (
        <main className="min-h-screen py-4">
            <Container>
                <div className="relative h-[40vh] w-full overflow-hidden">
                    {/* Background Image */}
                    <Image
                        src="/terminos-condiciones.jpg"
                        alt="Terminos y condiciones background"
                        fill
                        priority
                        className="object-cover rounded-4xl"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60 rounded-4xl" />

                    {/* Content Centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                            Terminos y condiciones
                        </h1>
                        <Logo className="text-white h-6 md:h-8 w-auto" />
                    </div>
                </div>
            </Container>
            <section className="py-16 bg-white">
                <Container>
                    <div className="space-y-12">
                        {/* Intro */}
                        <p className="text-slate-600 leading-relaxed">Al acceder y utilizar este sitio web, el usuario acepta cumplir con los presentes Términos y Condiciones. Si no está de acuerdo con alguno de ellos, deberá abstenerse de utilizar los servicios ofrecidos.</p>

                        <div className="space-y-10">
                            {/* Información de vehículos */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Información de vehículos
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    La información, imágenes, precios y características de los vehículos publicados son de carácter referencial y pueden variar sin previo aviso.
                                    Cofiño Stahl Usados no garantiza que toda la información esté libre de errores tipográficos o imprecisiones.
                                </p>
                            </section>

                            {/* Vehículos usados y en consignación */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Vehículos usados y en consignación
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Los vehículos usados y/o en consignación se ofrecen conforme a su disponibilidad, estado y condiciones acordadas.
                                    En el caso de vehículos en consignación, Cofiño Stahl Usados actúa como intermediario entre el propietario y el comprador.
                                </p>
                            </section>

                            {/* Ofertas y pujas */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Ofertas y pujas
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Las ofertas realizadas por los usuarios no garantizan la compra del vehículo. Toda oferta está sujeta a evaluación y aprobación por parte del propietario del vehículo o de Cofiño Stahl Usados, según corresponda.
                                    Las ofertas u pujas enviadas por el usuario podrán considerarse vinculantes una vez confirmadas, según las condiciones específicas del proceso.
                                </p>
                            </section>

                            {/* Precios */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Precios
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Los precios publicados pueden corresponder a precios sugeridos, precios iniciales de subasta o valores de referencia, y no constituyen una oferta final de venta hasta que exista confirmación formal.
                                </p>
                            </section>

                            {/* Disponibilidad */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Disponibilidad
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    La disponibilidad de los vehículos puede cambiar en cualquier momento. Cofiño Stahl Usados se reserva el derecho de retirar o modificar publicaciones sin previo aviso.
                                </p>
                            </section>

                            {/* Responsabilidad */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Responsabilidad
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Cofiño Stahl Usados no se hace responsable por el uso indebido del sitio web ni por daños derivados de la información publicada.
                                    El usuario es responsable de verificar el estado, condiciones y documentación del vehículo antes de concretar cualquier transacción.
                                </p>
                            </section>

                            {/* Modificaciones */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Modificaciones
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Cofiño Stahl Usados se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.
                                    Las modificaciones entrarán en vigor desde su publicación en el sitio web.
                                </p>
                            </section>

                            {/* Aceptación */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Aceptación
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    El uso continuo del sitio web implica la aceptación total de los presentes Términos y Condiciones.
                                </p>
                            </section>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    )
}
