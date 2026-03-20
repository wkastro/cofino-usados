import { PrismaClient } from "../../generated/prisma/client";

// placa → urls de imágenes en orden
const imagenesPorVehiculo: Record<string, string[]> = {
  P979JRD: ["/uploads/vehiculos/p979jrd/1.jpg", "/uploads/vehiculos/p979jrd/2.jpg", "/uploads/vehiculos/p979jrd/3.jpg"],
  P992JZW: ["/uploads/vehiculos/p992jzw/1.jpg", "/uploads/vehiculos/p992jzw/2.jpg", "/uploads/vehiculos/p992jzw/3.jpg"],
  P714FYW: ["/uploads/vehiculos/p714fyw/1.jpg", "/uploads/vehiculos/p714fyw/2.jpg", "/uploads/vehiculos/p714fyw/3.jpg"],
  P718HYW: ["/uploads/vehiculos/p718hyw/1.jpg", "/uploads/vehiculos/p718hyw/2.jpg", "/uploads/vehiculos/p718hyw/3.jpg"],
  P471KPG: ["/uploads/vehiculos/p471kpg/1.jpg", "/uploads/vehiculos/p471kpg/2.jpg", "/uploads/vehiculos/p471kpg/3.jpg"],
  P306JLQ: ["/uploads/vehiculos/p306jlq/1.jpg", "/uploads/vehiculos/p306jlq/2.jpg", "/uploads/vehiculos/p306jlq/3.jpg"],
  P280KTX: ["/uploads/vehiculos/p280ktx/1.jpg", "/uploads/vehiculos/p280ktx/2.jpg", "/uploads/vehiculos/p280ktx/3.jpg"],
  P829KPG: ["/uploads/vehiculos/p829kpg/1.jpg", "/uploads/vehiculos/p829kpg/2.jpg", "/uploads/vehiculos/p829kpg/3.jpg"],
  P546GLP: ["/uploads/vehiculos/p546glp/1.jpg", "/uploads/vehiculos/p546glp/2.jpg", "/uploads/vehiculos/p546glp/3.jpg"],
  P456KPF: ["/uploads/vehiculos/p456kpf/1.jpg", "/uploads/vehiculos/p456kpf/2.jpg", "/uploads/vehiculos/p456kpf/3.jpg"],
  P825KSP: ["/uploads/vehiculos/p825ksp/1.jpg", "/uploads/vehiculos/p825ksp/2.jpg", "/uploads/vehiculos/p825ksp/3.jpg"],
  P004JNF: ["/uploads/vehiculos/p004jnf/1.jpg", "/uploads/vehiculos/p004jnf/2.jpg", "/uploads/vehiculos/p004jnf/3.jpg"],
  P859FYX: ["/uploads/vehiculos/p859fyx/1.jpg", "/uploads/vehiculos/p859fyx/2.jpg", "/uploads/vehiculos/p859fyx/3.jpg"],
  P794JWB: ["/uploads/vehiculos/p794jwb/1.jpg", "/uploads/vehiculos/p794jwb/2.jpg", "/uploads/vehiculos/p794jwb/3.jpg"],
  P945JPT: ["/uploads/vehiculos/p945jpt/1.jpg", "/uploads/vehiculos/p945jpt/2.jpg", "/uploads/vehiculos/p945jpt/3.jpg"],
  P743KMC: ["/uploads/vehiculos/p743kmc/1.jpg", "/uploads/vehiculos/p743kmc/2.jpg", "/uploads/vehiculos/p743kmc/3.jpg"],
  P406KFF: ["/uploads/vehiculos/p406kff/1.jpg", "/uploads/vehiculos/p406kff/2.jpg", "/uploads/vehiculos/p406kff/3.jpg"],
  P164JNW: ["/uploads/vehiculos/p164jnw/1.jpg", "/uploads/vehiculos/p164jnw/2.jpg", "/uploads/vehiculos/p164jnw/3.jpg"],
  P407KFF: ["/uploads/vehiculos/p407kff/1.jpg", "/uploads/vehiculos/p407kff/2.jpg", "/uploads/vehiculos/p407kff/3.jpg"],
  P698JXW: ["/uploads/vehiculos/p698jxw/1.jpg", "/uploads/vehiculos/p698jxw/2.jpg", "/uploads/vehiculos/p698jxw/3.jpg"],
  P782JWP: ["/uploads/vehiculos/p782jwp/1.jpg", "/uploads/vehiculos/p782jwp/2.jpg", "/uploads/vehiculos/p782jwp/3.jpg"],
  P408KBH: ["/uploads/vehiculos/p408kbh/1.jpg", "/uploads/vehiculos/p408kbh/2.jpg", "/uploads/vehiculos/p408kbh/3.jpg"],
  P405KFF: ["/uploads/vehiculos/p405kff/1.jpg", "/uploads/vehiculos/p405kff/2.jpg", "/uploads/vehiculos/p405kff/3.jpg"],
  P212GDB: ["/uploads/vehiculos/p212gdb/1.jpg", "/uploads/vehiculos/p212gdb/2.jpg", "/uploads/vehiculos/p212gdb/3.jpg"],
  P404KFF: ["/uploads/vehiculos/p404kff/1.jpg", "/uploads/vehiculos/p404kff/2.jpg", "/uploads/vehiculos/p404kff/3.jpg"],
  P825KRM: ["/uploads/vehiculos/p825krm/1.jpg", "/uploads/vehiculos/p825krm/2.jpg", "/uploads/vehiculos/p825krm/3.jpg"],
  P364KJB: ["/uploads/vehiculos/p364kjb/1.jpg", "/uploads/vehiculos/p364kjb/2.jpg", "/uploads/vehiculos/p364kjb/3.jpg"],
  P824JBR: ["/uploads/vehiculos/p824jbr/1.jpg", "/uploads/vehiculos/p824jbr/2.jpg", "/uploads/vehiculos/p824jbr/3.jpg"],
  P081JWY: ["/uploads/vehiculos/p081jwy/1.jpg", "/uploads/vehiculos/p081jwy/2.jpg", "/uploads/vehiculos/p081jwy/3.jpg"],
  P556JLN: ["/uploads/vehiculos/p556jln/1.jpg", "/uploads/vehiculos/p556jln/2.jpg", "/uploads/vehiculos/p556jln/3.jpg"],
};

export async function seedVehiculoImagenes(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const [placa, urls] of Object.entries(imagenesPorVehiculo)) {
    const vehiculo = await prisma.vehiculo.findUnique({ where: { placa } });

    if (!vehiculo) {
      console.warn(`  [vehiculo-imagenes] Vehículo ${placa} no encontrado — omitido.`);
      skipped++;
      continue;
    }

    const existentes = await prisma.galeria.count({
      where: { vehiculoId: vehiculo.id },
    });

    if (existentes > 0) {
      skipped++;
      continue;
    }

    await prisma.galeria.createMany({
      data: urls.map((url, i) => ({
        vehiculoId: vehiculo.id,
        url,
        orden: i + 1,
      })),
    });

    created += urls.length;
  }

  console.log(
    `  [vehiculo-imagenes] Creadas: ${created} | Vehículos omitidos: ${skipped}`
  );
}
