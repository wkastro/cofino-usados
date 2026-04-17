import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { seedAdmin }             from "./seeds/admin.seed";
import { seedMarcas }            from "./seeds/marca.seed";
import { seedSucursales }        from "./seeds/sucursal.seed";
import { seedCategorias }            from "./seeds/tipo-vehiculo.seed";
import { seedEtiquetasComerciales }  from "./seeds/etiqueta.seed";
import { seedVehiculos }         from "./seeds/vehiculo.seed";
import { seedVehiculoImagenes }  from "./seeds/vehiculo-imagen.seed";
import { seedVehiculoEtiquetas } from "./seeds/vehiculo-etiqueta.seed";
import { seedReviews }           from "./seeds/review.seed";
import { seedPageContent }       from "./seeds/page-content.seed";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const seeds = [
  { name: "Admin",              fn: seedAdmin },
  { name: "Marcas",             fn: seedMarcas },
  { name: "Sucursales",         fn: seedSucursales },
  { name: "Categorias",             fn: seedCategorias },
  { name: "EtiquetasComerciales",   fn: seedEtiquetasComerciales },
  { name: "Vehiculos",          fn: seedVehiculos },
  { name: "Reviews",            fn: seedReviews },
  { name: "VehiculoImagenes",   fn: seedVehiculoImagenes },
  { name: "VehiculoEtiquetas",  fn: seedVehiculoEtiquetas },
  { name: "PageContent",        fn: seedPageContent },
];

async function main() {
  console.log("🌱 Iniciando seeds...\n");

  for (const seed of seeds) {
    console.log(`▶ ${seed.name}`);
    await seed.fn(prisma);
  }

  console.log("\n✅ Seeds completados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
