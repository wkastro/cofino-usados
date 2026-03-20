import { PrismaClient, Transmision, Combustible, EstadoVenta, Traccion } from "../../generated/prisma/client";

const vehiculos = [
  { nombre: "CHEVROLET TRAX 2018 - 56",                    slug: "chevrolet-trax-2018-56",                    codigo: "56",   placa: "P979JRD", precio: 115750, preciosiniva: 103348, kilometraje: 106841, motor: 1800, anio: 2018, traccion: "4x2", color_exterior: "Blanco Olimpico",      color_interior: "Café",         transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Chevrolet",  categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "LAND ROVER DISCOVERY 4X4 2018 - 1251",        slug: "land-rover-discovery-4x4-2018-1251",        codigo: "1251", placa: "P992JZW", precio: 259900, preciosiniva: 232054, kilometraje:  86181, motor: 3000, anio: 2018, traccion: "4x4", color_exterior: "Plata Metálico",       color_interior: "Gris",         transmision: "AUTOMATICO", combustible: "DIESEL",   estado: "DISPONIBLE", marca: "Land Rover", categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "MAZDA CX-5 2016 - 763",                       slug: "mazda-cx-5-2016-763",                       codigo: "763",  placa: "P714FYW", precio: 109900, preciosiniva:  98125, kilometraje: 119138, motor: 2000, anio: 2016, traccion: "4x2", color_exterior: "Platinado Sonic",      color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Mazda",      categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "LAND ROVER DISCOVERY 4X4 2020 - 2186",        slug: "land-rover-discovery-4x4-2020-2186",        codigo: "2186", placa: "P718HYW", precio: 344900, preciosiniva: 307946, kilometraje:  81556, motor: 3000, anio: 2020, traccion: "4x4", color_exterior: "Eiger Grey",           color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "DIESEL",   estado: "DISPONIBLE", marca: "Land Rover", categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "MAZDA 2 SPORT 2024 - 2388",                   slug: "mazda-2-sport-2024-2388",                   codigo: "2388", placa: "P471KPG", precio: 129900, preciosiniva: 115982, kilometraje:  16264, motor: 1500, anio: 2024, traccion: "4x2", color_exterior: "Blanco Metálico",      color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Mazda",      categoria: "Sedán",  sucursal: "Agencia Roosevelt" },
  { nombre: "FORD BRONCO SPORT 4X4 2021 - 2583",           slug: "ford-bronco-sport-4x4-2021-2583",           codigo: "2583", placa: "P306JLQ", precio: 229900, preciosiniva: 205268, kilometraje:  54621, motor: 2000, anio: 2021, traccion: "4x4", color_exterior: "Café",                 color_interior: "Café",         transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Ford",       categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "RENAULT ARKANA 2024 - 3112",                  slug: "renault-arkana-2024-3112",                  codigo: "3112", placa: "P280KTX", precio: 156900, preciosiniva: 140089, kilometraje:   9753, motor: 1333, anio: 2024, traccion: "4x2", color_exterior: "Gris Metálico",        color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Renault",    categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "MAZDA CX-5 2024 - 2985",                      slug: "mazda-cx-5-2024-2985",                      codigo: "2985", placa: "P829KPG", precio: 229900, preciosiniva: 205268, kilometraje:  28674, motor: 2000, anio: 2024, traccion: "4x2", color_exterior: "Rojo",                 color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Mazda",      categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "RENAULT DUSTER 2017 - 9879",                  slug: "renault-duster-2017-9879",                  codigo: "9879", placa: "P546GLP", precio:  64900, preciosiniva:  57946, kilometraje: 160516, motor: 1598, anio: 2017, traccion: "4x2", color_exterior: "Rojo Fuego",           color_interior: "Negro",        transmision: "MANUAL",     combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Renault",    categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "MAXUS T60 4X4 2024 - 3007",                   slug: "maxus-t60-4x4-2024-3007",                   codigo: "3007", placa: "P456KPF", precio: 136530, preciosiniva: 121902, kilometraje:  55183, motor: 2798, anio: 2024, traccion: "4x4", color_exterior: "Negro",                color_interior: "Negro",        transmision: "MANUAL",     combustible: "DIESEL",   estado: "DISPONIBLE", marca: "Maxus",      categoria: "Pickup", sucursal: "Agencia Yurrita" },
  { nombre: "KIA SELTOS 2025 - 3183",                      slug: "kia-seltos-2025-3183",                      codigo: "3183", placa: "P825KSP", precio: 188900, preciosiniva: 168661, kilometraje:  18034, motor: 1500, anio: 2025, traccion: "4x2", color_exterior: "Gris",                 color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "KIA",        categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "LAND ROVER RANGE ROVER EVOQUE 4X4 2020 - 3293", slug: "land-rover-range-rover-evoque-4x4-2020-3293", codigo: "3293", placa: "P004JNF", precio: 339800, preciosiniva: 303393, kilometraje: 47840, motor: 2000, anio: 2020, traccion: "4x4", color_exterior: "Sepia",                color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Land Rover", categoria: "Suv",    sucursal: "Lexus Semi Nuevos,  Zona 5" },
  { nombre: "AUDI Q5 2.0 RGI 4X4 2016 - 2178",            slug: "audi-q5-2.0-rgi-4x4-2016-2178",            codigo: "2178", placa: "P859FYX", precio: 145000, preciosiniva: 129464, kilometraje:  71102, motor: 1968, anio: 2016, traccion: "4x4", color_exterior: "Blanco",               color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "DIESEL",   estado: "DISPONIBLE", marca: "Audi",       categoria: "Suv",    sucursal: "Lexus Semi Nuevos,  Zona 5" },
  { nombre: "VOLKSWAGEN AMAROK 4X4 2022 - 2935",           slug: "volkswagen-amarok-4x4-2022-2935",           codigo: "2935", placa: "P794JWB", precio: 209900, preciosiniva: 187411, kilometraje: 105907, motor: 2000, anio: 2022, traccion: "4x4", color_exterior: "Blanco",               color_interior: "Negro",        transmision: "MANUAL",     combustible: "DIESEL",   estado: "DISPONIBLE", marca: "Volskwagen", categoria: "Pickup", sucursal: "Agencia Yurrita" },
  { nombre: "PEUGEOT 3008 ALLURE 2018 - 2932",             slug: "peugeot-3008-allure-2018-2932",             codigo: "2932", placa: "P945JPT", precio: 133140, preciosiniva: 118875, kilometraje:  83443, motor: 1598, anio: 2018, traccion: "4x2", color_exterior: "Rojo Ultimate",        color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Peugeot",    categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "CHANGAN CS15 2023 - 3189",                    slug: "changan-cs15-2023-3189",                    codigo: "3189", placa: "P743KMC", precio: 115070, preciosiniva: 102741, kilometraje:  20691, motor: 1500, anio: 2023, traccion: "4x2", color_exterior: "Naranja",              color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Changan",    categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "TOYOTA INNOVA 2023 - 3379",                   slug: "toyota-innova-2023-3379",                   codigo: "3379", placa: "P406KFF", precio: 147690, preciosiniva: 131866, kilometraje:  73514, motor: 2694, anio: 2023, traccion: "4x2", color_exterior: "Café Metálico",        color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Toyota",     categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "RENAULT DUSTER 2022 - 3128",                  slug: "renault-duster-2022-3128",                  codigo: "3128", placa: "P164JNW", precio: 112900, preciosiniva: 100804, kilometraje:  60606, motor: 1598, anio: 2022, traccion: "4x2", color_exterior: "Negro Nacarado",       color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Renault",    categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "TOYOTA INNOVA 2023 - 3375",                   slug: "toyota-innova-2023-3375",                   codigo: "3375", placa: "P407KFF", precio: 148420, preciosiniva: 132518, kilometraje:  61336, motor: 2694, anio: 2023, traccion: "4x2", color_exterior: "Gris Metálico",        color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Toyota",     categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "CHEVROLET TRACKER 2022 - 3556",               slug: "chevrolet-tracker-2022-3556",               codigo: "3556", placa: "P698JXW", precio: 117900, preciosiniva: 105268, kilometraje:  34873, motor: 1200, anio: 2022, traccion: "4x2", color_exterior: "Rojo aperlado",        color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Chevrolet",  categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "TOYOTA INNOVA 2023 - 3383",                   slug: "toyota-innova-2023-3383",                   codigo: "3383", placa: "P782JWP", precio: 145200, preciosiniva: 129643, kilometraje:  82846, motor: 2694, anio: 2023, traccion: "4x2", color_exterior: "Blanco Perla",         color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Toyota",     categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "TOYOTA INNOVA 2023 - 3381",                   slug: "toyota-innova-2023-3381",                   codigo: "3381", placa: "P408KBH", precio: 143480, preciosiniva: 128107, kilometraje:  78030, motor: 2694, anio: 2023, traccion: "4x2", color_exterior: "Blanco Perla",         color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Toyota",     categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "TOYOTA INNOVA 2023 - 3408",                   slug: "toyota-innova-2023-3408",                   codigo: "3408", placa: "P405KFF", precio: 155840, preciosiniva: 139143, kilometraje:  70679, motor: 2694, anio: 2023, traccion: "4x2", color_exterior: "Café Metálico",        color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Toyota",     categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "RENAULT DUSTER 2017 - 3271",                  slug: "renault-duster-2017-3271",                  codigo: "3271", placa: "P212GDB", precio:  81610, preciosiniva:  72866, kilometraje:  90081, motor: 1998, anio: 2017, traccion: "4x2", color_exterior: "Rojo Fuego",           color_interior: "Beige",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Renault",    categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "TOYOTA INNOVA 2023 - 3417",                   slug: "toyota-innova-2023-3417",                   codigo: "3417", placa: "P404KFF", precio: 151150, preciosiniva: 134955, kilometraje:  67564, motor: 2694, anio: 2023, traccion: "4x2", color_exterior: "Café Metálico",        color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Toyota",     categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "MAXUS T60 4X4 2023 - 3008",                   slug: "maxus-t60-4x4-2023-3008",                   codigo: "3008", placa: "P825KRM", precio: 136900, preciosiniva: 122232, kilometraje:  73946, motor: 2798, anio: 2023, traccion: "4x4", color_exterior: "Negro",                color_interior: "Negro",        transmision: "MANUAL",     combustible: "DIESEL",   estado: "DISPONIBLE", marca: "Maxus",      categoria: "Pickup", sucursal: "Agencia Roosevelt" },
  { nombre: "RENAULT DUSTER 2023 - 3571",                  slug: "renault-duster-2023-3571",                  codigo: "3571", placa: "P364KJB", precio: 119900, preciosiniva: 107054, kilometraje:  15307, motor: 1330, anio: 2023, traccion: "4x2", color_exterior: "Blanco Hielo",         color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Renault",    categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "RENAULT CAPTUR 2021 - 3006",                  slug: "renault-captur-2021-3006",                  codigo: "3006", placa: "P824JBR", precio: 109900, preciosiniva:  98125, kilometraje:  49236, motor: 1998, anio: 2021, traccion: "4x2", color_exterior: "Blanco Glaciar-Negro", color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Renault",    categoria: "Suv",    sucursal: "Agencia Yurrita" },
  { nombre: "LAND ROVER EVOQUE 4X4 2023 - 3472",           slug: "land-rover-evoque-4x4-2023-3472",           codigo: "3472", placa: "P081JWY", precio: 369220, preciosiniva: 329661, kilometraje:  25335, motor: 2000, anio: 2023, traccion: "4x4", color_exterior: "Portofino Blue",       color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Land Rover", categoria: "Suv",    sucursal: "Agencia Roosevelt" },
  { nombre: "HONDA PILOT LX 4X4 2021 - 3726",             slug: "honda-pilot-lx-4x4-2021-3726",             codigo: "3726", placa: "P556JLN", precio: 247260, preciosiniva: 220768, kilometraje:  67033, motor: 3500, anio: 2021, traccion: "4x4", color_exterior: "Blanco",               color_interior: "Negro",        transmision: "AUTOMATICO", combustible: "GASOLINA", estado: "DISPONIBLE", marca: "Honda",      categoria: "Suv",    sucursal: "Agencia Roosevelt" },
];

const TRACCION_MAP: Record<string, Traccion> = {
  "4x4": Traccion.T4X4,
  "4x2": Traccion.T4X2,
  "AWD": Traccion.AWD,
  "4WD": Traccion.T4WD,
};

const TRANSMISION_MAP: Record<string, Transmision> = {
  AUTOMATICO: Transmision.AUTOMATICO,
  MANUAL:     Transmision.MANUAL,
};

const ESTADO_MAP: Record<string, EstadoVenta> = {
  DISPONIBLE: EstadoVenta.DISPONIBLE,
  RESERVADO:  EstadoVenta.RESERVADO,
  FACTURADO:  EstadoVenta.FACTURADO,
  VENDIDO:    EstadoVenta.VENDIDO,
};

export async function seedVehiculos(prisma: PrismaClient) {
  // Precarga catálogos como mapas nombre → id
  const marcaMap = Object.fromEntries(
    (await prisma.marca.findMany({ select: { id: true, nombre: true } })).map(m => [m.nombre, m.id])
  );
  const categoriaMap = Object.fromEntries(
    (await prisma.categoria.findMany({ select: { id: true, nombre: true } })).map(c => [c.nombre, c.id])
  );
  const sucursalMap = Object.fromEntries(
    (await prisma.sucursal.findMany({ select: { id: true, nombre: true } })).map(s => [s.nombre, s.id])
  );

  let created = 0;
  let skipped = 0;
  let omitted = 0;

  for (const v of vehiculos) {
    const marcaId    = marcaMap[v.marca];
    const categoriaId = categoriaMap[v.categoria];
    const sucursalId  = sucursalMap[v.sucursal];

    if (!marcaId || !categoriaId || !sucursalId) {
      console.warn(
        `  [vehiculos] ${v.placa} — catálogo no encontrado (marca: ${v.marca}, categoria: ${v.categoria}, sucursal: ${v.sucursal}) — omitido.`
      );
      omitted++;
      continue;
    }

    const data = {
      nombre:         v.nombre,
      slug:           v.slug,
      placa:          v.placa,
      codigo:         v.codigo,
      precio:         v.precio,
      preciosiniva:   v.preciosiniva,
      kilometraje:    v.kilometraje,
      motor:          String(v.motor),
      anio:           v.anio,
      traccion:       TRACCION_MAP[v.traccion] ?? Traccion.T4X2,
      color_interior: v.color_interior,
      color_exterior: v.color_exterior,
      transmision:    TRANSMISION_MAP[v.transmision] ?? Transmision.MANUAL,
      combustible:    v.combustible as Combustible,
      estado:         ESTADO_MAP[v.estado] ?? EstadoVenta.DISPONIBLE,
      marcaId,
      categoriaId,
      sucursalId,
    };

    const result = await prisma.vehiculo.upsert({
      where:  { placa: v.placa },
      create: data,
      update: data,
    });
    result ? created++ : skipped++;
  }

  console.log(
    `  [vehiculos] Creados: ${created} | Omitidos (ya existían): ${skipped} | Sin catálogo: ${omitted}`
  );
}
