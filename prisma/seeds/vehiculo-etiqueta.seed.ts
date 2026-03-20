import { PrismaClient } from "../../generated/prisma/client";

// placa → slugs de etiquetas a asignar
const asignaciones: Record<string, string[]> = {
  P979JRD: ["nuevo-ingreso"],
  P992JZW: ["autos-certificados"],
  P714FYW: ["baja-de-precio"],
  P718HYW: ["autos-certificados"],
  P471KPG: ["nuevo-ingreso"],
  P306JLQ: ["nuevo-ingreso", "autos-certificados"],
  P280KTX: ["liquidacion"],
  P829KPG: ["baja-de-precio"],
  P546GLP: ["liquidacion", "baja-de-precio"],
  P456KPF: ["consignacion"],
  P825KSP: ["nuevo-ingreso"],
  P004JNF: ["autos-certificados"],
  P859FYX: ["baja-de-precio"],
  P794JWB: ["consignacion"],
  P945JPT: ["liquidacion"],
  P743KMC: ["nuevo-ingreso"],
  P406KFF: ["autos-certificados"],
  P164JNW: ["baja-de-precio"],
  P407KFF: ["nuevo-ingreso", "autos-certificados"],
  P698JXW: ["consignacion"],
  P782JWP: ["baja-de-precio"],
  P824JBR: ["nuevo-ingreso", "autos-certificados"],
  P081JWY: ["autos-certificados"],
  P556JLN: ["consignacion"],
};

export async function seedVehiculoEtiquetas(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const [placa, slugs] of Object.entries(asignaciones)) {
    const vehiculo = await prisma.vehiculo.findUnique({ where: { placa } });

    if (!vehiculo) {
      console.warn(`  [vehiculo-etiquetas] Vehículo ${placa} no encontrado — omitido.`);
      skipped++;
      continue;
    }

    for (const slug of slugs) {
      const etiqueta = await prisma.etiquetaComercial.findUnique({ where: { slug } });

      if (!etiqueta) {
        console.warn(`  [vehiculo-etiquetas] Etiqueta "${slug}" no encontrada — omitida.`);
        continue;
      }

      const existing = await prisma.vehiculoEtiquetaComercial.findUnique({
        where: {
          vehiculoId_etiquetaId: {
            vehiculoId: vehiculo.id,
            etiquetaId: etiqueta.id,
          },
        },
      });

      if (existing) { skipped++; continue; }

      await prisma.vehiculoEtiquetaComercial.create({
        data: {
          vehiculoId: vehiculo.id,
          etiquetaId: etiqueta.id,
        },
      });
      created++;
    }
  }

  console.log(
    `  [vehiculo-etiquetas] Creadas: ${created} | Omitidas (ya existían): ${skipped}`
  );
}
