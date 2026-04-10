import { PrismaClient, Transmision, Combustible, EstadoVenta, Traccion } from "../../generated/prisma/client";

const vehiculos = [
  // ── SUVs (12) ─────────────────────────────────────────────────────────────────
  { nombre: "CHEVROLET TRAX 2018 - 56",                slug: "chevrolet-trax-2018-56",                codigo: "56",   placa: "P979JRD", precio: 115750, kilometraje: 106841, motor: 1800, anio: 2018, traccion: "4x2", color_exterior: "Blanco Olimpico",      color_interior: "Café",        transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Chevrolet", categoria: "Suv",       sucursal: "Agencia Roosevelt" },
  { nombre: "MAZDA CX-5 2016 - 763",                   slug: "mazda-cx-5-2016-763",                   codigo: "763",  placa: "P714FYW", precio: 109900, preciosiniva:  98125, kilometraje: 119138, motor: 2000, anio: 2016, traccion: "4x2", color_exterior: "Platinado Sonic",      color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Mazda",     categoria: "Suv",       sucursal: "Agencia Yurrita" },
  { nombre: "FORD BRONCO SPORT 4X4 2021 - 2583",       slug: "ford-bronco-sport-4x4-2021-2583",       codigo: "2583", placa: "P306JLQ", precio: 229900, preciosiniva: 205268, kilometraje:  54621, motor: 2000, anio: 2021, traccion: "4x4", color_exterior: "Café",                 color_interior: "Café",        transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Ford",      categoria: "Suv",       sucursal: "Agencia Yurrita" },
  { nombre: "RENAULT ARKANA 2024 - 3112",               slug: "renault-arkana-2024-3112",               codigo: "3112", placa: "P280KTX", precio: 156900, preciosiniva: 140089, kilometraje:   9753, motor: 1333, anio: 2024, traccion: "4x2", color_exterior: "Gris Metálico",        color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Renault",   categoria: "Suv",       sucursal: "Agencia Roosevelt" },
  { nombre: "RENAULT DUSTER 2017 - 9879",               slug: "renault-duster-2017-9879",               codigo: "9879", placa: "P546GLP", precio:  64900, preciosiniva:  57946, kilometraje: 160516, motor: 1598, anio: 2017, traccion: "4x2", color_exterior: "Rojo Fuego",           color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Renault",   categoria: "Suv",       sucursal: "Agencia Yurrita" },
  { nombre: "RENAULT CAPTUR 2021 - 3006",               slug: "renault-captur-2021-3006",               codigo: "3006", placa: "P824JBR", precio: 109900, preciosiniva:  98125, kilometraje:  49236, motor: 1998, anio: 2021, traccion: "4x2", color_exterior: "Blanco Glaciar-Negro", color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Renault",   categoria: "Suv",       sucursal: "Agencia Yurrita" },
  { nombre: "HONDA PILOT LX 4X4 2021 - 3726",           slug: "honda-pilot-lx-4x4-2021-3726",           codigo: "3726", placa: "P556JLN", precio: 247260, preciosiniva: 220768, kilometraje:  67033, motor: 3500, anio: 2021, traccion: "4x4", color_exterior: "Blanco",               color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Honda",     categoria: "Suv",       sucursal: "Agencia Roosevelt" },
  { nombre: "HYUNDAI TUCSON 2023 - 4001",                slug: "hyundai-tucson-2023-4001",                codigo: "4001", placa: "P112LBX", precio: 198500, preciosiniva: 177232, kilometraje:  31200, motor: 2000, anio: 2023, traccion: "4x2", color_exterior: "Azul Metálico",        color_interior: "Gris",        transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Hyundai",   categoria: "Suv",       sucursal: "Agencia Zona 10" },
  { nombre: "SUBARU FORESTER AWD 2023 - 4002",          slug: "subaru-forester-awd-2023-4002",          codigo: "4002", placa: "P223LCY", precio: 245000, preciosiniva: 218750, kilometraje:  18500, motor: 2500, anio: 2023, traccion: "AWD", color_exterior: "Verde Jasper",         color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Subaru",    categoria: "Suv",       sucursal: "Agencia Zona 10" },
  { nombre: "JEEP WRANGLER 4X4 2022 - 4003",            slug: "jeep-wrangler-4x4-2022-4003",            codigo: "4003", placa: "P334LDZ", precio: 385000, preciosiniva: 343750, kilometraje:  42000, motor: 3600, anio: 2022, traccion: "4x4", color_exterior: "Verde Sarge",          color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Jeep",      categoria: "Suv",       sucursal: "Agencia Roosevelt" },
  { nombre: "CHERY TIGGO 7 PRO 2024 - 4004",            slug: "chery-tiggo-7-pro-2024-4004",            codigo: "4004", placa: "P445LEA", precio: 165000, preciosiniva: 147321, kilometraje:   8200, motor: 1500, anio: 2024, traccion: "4x2", color_exterior: "Blanco Perla",         color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Reservado",  marca: "Chery",     categoria: "Suv",       sucursal: "Agencia Yurrita" },
  { nombre: "MG ZS COMFORT 2024 - 4005",                slug: "mg-zs-comfort-2024-4005",                codigo: "4005", placa: "P556LFB", precio: 142000, preciosiniva: 126786, kilometraje:  12300, motor: 1500, anio: 2024, traccion: "4x2", color_exterior: "Rojo Dynamic",         color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "MG",        categoria: "Suv",       sucursal: "Agencia Zona 10" },

  // ── Pickups (8) ───────────────────────────────────────────────────────────────
  { nombre: "MAXUS T60 4X4 2024 - 3007",                slug: "maxus-t60-4x4-2024-3007",                codigo: "3007", placa: "P456KPF", precio: 136530, preciosiniva: 121902, kilometraje:  55183, motor: 2798, anio: 2024, traccion: "4x4", color_exterior: "Negro",                color_interior: "Negro",       transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "Maxus",     categoria: "Pickup",    sucursal: "Agencia Yurrita" },
  { nombre: "VOLKSWAGEN AMAROK 4X4 2022 - 2935",        slug: "volkswagen-amarok-4x4-2022-2935",        codigo: "2935", placa: "P794JWB", precio: 209900, preciosiniva: 187411, kilometraje: 105907, motor: 2000, anio: 2022, traccion: "4x4", color_exterior: "Blanco",               color_interior: "Negro",       transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "Volskwagen",categoria: "Pickup",    sucursal: "Agencia Yurrita" },
  { nombre: "NISSAN FRONTIER 4X4 2022 - 4006",          slug: "nissan-frontier-4x4-2022-4006",          codigo: "4006", placa: "P667LGC", precio: 225000, preciosiniva: 200893, kilometraje:  68000, motor: 2500, anio: 2022, traccion: "4x4", color_exterior: "Gris Oscuro",          color_interior: "Negro",       transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "Nissan",    categoria: "Pickup",    sucursal: "Agencia Yurrita" },
  { nombre: "TOYOTA HILUX 4X4 2021 - 4007",             slug: "toyota-hilux-4x4-2021-4007",             codigo: "4007", placa: "P778LHD", precio: 258000, preciosiniva: 230357, kilometraje:  85000, motor: 2800, anio: 2021, traccion: "4x4", color_exterior: "Plata",                color_interior: "Gris",        transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "Toyota",    categoria: "Pickup",    sucursal: "Agencia Roosevelt" },
  { nombre: "MITSUBISHI L200 4X4 2022 - 4008",          slug: "mitsubishi-l200-4x4-2022-4008",          codigo: "4008", placa: "P889LIE", precio: 215000, preciosiniva: 191964, kilometraje:  52000, motor: 2400, anio: 2022, traccion: "4x4", color_exterior: "Negro Mica",           color_interior: "Negro",       transmision: "Automático", combustible: "Diesel",    estado: "Reservado",  marca: "Mitsubishi",categoria: "Pickup",    sucursal: "Agencia Yurrita" },
  { nombre: "ISUZU D-MAX 4X4 2023 - 4009",              slug: "isuzu-d-max-4x4-2023-4009",              codigo: "4009", placa: "P990LJF", precio: 235000, preciosiniva: 209821, kilometraje:  35000, motor: 3000, anio: 2023, traccion: "4x4", color_exterior: "Rojo Venecia",         color_interior: "Negro",       transmision: "Automático", combustible: "Diesel",    estado: "Disponible", marca: "Isuzu",     categoria: "Pickup",    sucursal: "Agencia Roosevelt" },
  { nombre: "FORD RANGER 4X4 2023 - 4010",              slug: "ford-ranger-4x4-2023-4010",              codigo: "4010", placa: "P101LKG", precio: 289000, preciosiniva: 257946, kilometraje:  28000, motor: 2000, anio: 2023, traccion: "4x4", color_exterior: "Azul Lightning",       color_interior: "Negro",       transmision: "Automático", combustible: "Diesel",    estado: "Disponible", marca: "Ford",      categoria: "Pickup",    sucursal: "Agencia Zona 10" },
  { nombre: "MAXUS T60 4X4 2023 - 3008",                slug: "maxus-t60-4x4-2023-3008",                codigo: "3008", placa: "P825KRM", precio: 136900, preciosiniva: 122232, kilometraje:  73946, motor: 2798, anio: 2023, traccion: "4x4", color_exterior: "Plata",                color_interior: "Negro",       transmision: "Manual",     combustible: "Diesel",    estado: "Reservado",    marca: "Maxus",     categoria: "Pickup",    sucursal: "Agencia Roosevelt" },

  // ── Sedanes (6) ───────────────────────────────────────────────────────────────
  { nombre: "HONDA CIVIC 2023 - 4011",                  slug: "honda-civic-2023-4011",                  codigo: "4011", placa: "P212LLH", precio: 195000, preciosiniva: 174107, kilometraje:  22000, motor: 1500, anio: 2023, traccion: "4x2", color_exterior: "Gris Lunar",           color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Honda",     categoria: "Sedán",     sucursal: "Agencia Roosevelt" },
  { nombre: "NISSAN SENTRA 2022 - 4012",                slug: "nissan-sentra-2022-4012",                codigo: "4012", placa: "P323LMI", precio: 155000, preciosiniva: 138393, kilometraje:  38000, motor: 2000, anio: 2022, traccion: "4x2", color_exterior: "Blanco",               color_interior: "Beige",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Nissan",    categoria: "Sedán",     sucursal: "Agencia Zona 10" },
  { nombre: "CHEVROLET ONIX 2023 - 4013",               slug: "chevrolet-onix-2023-4013",               codigo: "4013", placa: "P434LNJ", precio:  98000, preciosiniva:  87500, kilometraje:  45000, motor: 1000, anio: 2023, traccion: "4x2", color_exterior: "Azul Midnight",        color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Chevrolet", categoria: "Sedán",     sucursal: "Agencia Yurrita" },
  { nombre: "KIA FORTE 2021 - 4014",                    slug: "kia-forte-2021-4014",                    codigo: "4014", placa: "P545LOK", precio: 135000, preciosiniva: 120536, kilometraje:  61000, motor: 2000, anio: 2021, traccion: "4x2", color_exterior: "Rojo Cereza",          color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Reservado",    marca: "KIA",       categoria: "Sedán",     sucursal: "Agencia Yurrita" },
  { nombre: "BYD SEAL 2024 - 4015",                     slug: "byd-seal-2024-4015",                     codigo: "4015", placa: "P656LPL", precio: 310000, preciosiniva: 276786, kilometraje:   5200, motor: 0,    anio: 2024, traccion: "4x2", color_exterior: "Aurora Green",         color_interior: "Gris",        transmision: "Automático", combustible: "Electrico", estado: "Disponible", marca: "BYD",       categoria: "Sedán",     sucursal: "Agencia Zona 10" },
  { nombre: "MAZDA 3 SEDAN 2022 - 4016",                slug: "mazda-3-sedan-2022-4016",                codigo: "4016", placa: "P767LQM", precio: 175000, preciosiniva: 156250, kilometraje:  29000, motor: 2000, anio: 2022, traccion: "4x2", color_exterior: "Soul Red Crystal",     color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Mazda",     categoria: "Sedán",     sucursal: "Agencia Zona 10" },

  // ── Hatchbacks (6) ────────────────────────────────────────────────────────────
  { nombre: "MAZDA 2 SPORT 2024 - 2388",                slug: "mazda-2-sport-2024-2388",                codigo: "2388", placa: "P471KPG", precio: 129900, preciosiniva: 115982, kilometraje:  16264, motor: 1500, anio: 2024, traccion: "4x2", color_exterior: "Blanco Metálico",      color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Mazda",     categoria: "Hatchback", sucursal: "Agencia Roosevelt" },
  { nombre: "CHANGAN CS15 2023 - 3189",                  slug: "changan-cs15-2023-3189",                  codigo: "3189", placa: "P743KMC", precio: 115070, preciosiniva: 102741, kilometraje:  20691, motor: 1500, anio: 2023, traccion: "4x2", color_exterior: "Naranja",              color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Changan",   categoria: "Hatchback", sucursal: "Agencia Roosevelt" },
  { nombre: "HYUNDAI I20 2023 - 4017",                  slug: "hyundai-i20-2023-4017",                  codigo: "4017", placa: "P878LRN", precio:  92000, preciosiniva:  82143, kilometraje:  19500, motor: 1200, anio: 2023, traccion: "4x2", color_exterior: "Amarillo Dragon",      color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Hyundai",   categoria: "Hatchback", sucursal: "Agencia Yurrita" },
  { nombre: "HYUNDAI KONA ELECTRIC 2024 - 4018",        slug: "hyundai-kona-electric-2024-4018",        codigo: "4018", placa: "P989LSO", precio: 275000, preciosiniva: 245536, kilometraje:   3100, motor: 0,    anio: 2024, traccion: "4x2", color_exterior: "Blanco Atlas",         color_interior: "Gris Claro",  transmision: "Automático", combustible: "Electrico", estado: "Disponible", marca: "Hyundai",   categoria: "Hatchback", sucursal: "Agencia Zona 10" },
  { nombre: "BYD DOLPHIN 2024 - 4027",                  slug: "byd-dolphin-2024-4027",                  codigo: "4027", placa: "P988MBX", precio: 195000, preciosiniva: 174107, kilometraje:   2800, motor: 0,    anio: 2024, traccion: "4x2", color_exterior: "Azul Surf",            color_interior: "Blanco",      transmision: "Automático", combustible: "Electrico", estado: "Disponible", marca: "BYD",       categoria: "Hatchback", sucursal: "Agencia Roosevelt" },
  { nombre: "JAC S1 2022 - 4030",                        slug: "jac-s1-2022-4030",                        codigo: "4030", placa: "P311MEA", precio:  78000, preciosiniva:  69643, kilometraje:  35000, motor: 1500, anio: 2022, traccion: "4x2", color_exterior: "Gris Titanio",         color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Jac",       categoria: "Hatchback", sucursal: "Agencia Yurrita" },

  // ── Híbridos (4) ──────────────────────────────────────────────────────────────
  { nombre: "TOYOTA COROLLA CROSS HYBRID 2024 - 4019",  slug: "toyota-corolla-cross-hybrid-2024-4019",  codigo: "4019", placa: "P100LTP", precio: 265000, preciosiniva: 236607, kilometraje:  11000, motor: 1800, anio: 2024, traccion: "AWD", color_exterior: "Plata Celestita",      color_interior: "Negro",       transmision: "Automático", combustible: "Hibrido",   estado: "Disponible", marca: "Toyota",    categoria: "Hybrid",    sucursal: "Agencia Zona 10" },
  { nombre: "HONDA CR-V HYBRID AWD 2024 - 4020",        slug: "honda-cr-v-hybrid-awd-2024-4020",        codigo: "4020", placa: "P211LUQ", precio: 345000, preciosiniva: 308036, kilometraje:   7500, motor: 2000, anio: 2024, traccion: "AWD", color_exterior: "Azul Canyon",          color_interior: "Negro",       transmision: "Automático", combustible: "Hibrido",   estado: "Disponible", marca: "Honda",     categoria: "Hybrid",    sucursal: "Agencia Zona 10" },
  { nombre: "TOYOTA RAV4 HYBRID AWD 2023 - 4021",       slug: "toyota-rav4-hybrid-awd-2023-4021",       codigo: "4021", placa: "P322LVR", precio: 295000, preciosiniva: 263393, kilometraje:  24000, motor: 2500, anio: 2023, traccion: "AWD", color_exterior: "Gris Magnético",       color_interior: "Negro",       transmision: "Automático", combustible: "Hibrido",   estado: "Disponible", marca: "Toyota",    categoria: "Hybrid",    sucursal: "Agencia Yurrita" },
  { nombre: "KIA NIRO HYBRID 2023 - 4022",              slug: "kia-niro-hybrid-2023-4022",              codigo: "4022", placa: "P433LWS", precio: 235000, preciosiniva: 209821, kilometraje:  16000, motor: 1600, anio: 2023, traccion: "4x2", color_exterior: "Interstellar Gray",    color_interior: "Beige",       transmision: "Automático", combustible: "Hibrido",   estado: "Reservado",  marca: "KIA",       categoria: "Hybrid",    sucursal: "Agencia Roosevelt" },

  // ── Blindados (3) ─────────────────────────────────────────────────────────────
  { nombre: "BMW X5 BLINDADO 2021 - 4023",              slug: "bmw-x5-blindado-2021-4023",              codigo: "4023", placa: "P544LXT", precio: 520000, preciosiniva: 464286, kilometraje:  38000, motor: 3000, anio: 2021, traccion: "AWD", color_exterior: "Negro Zafiro",         color_interior: "Cognac",      transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "BMW",       categoria: "Blindado",  sucursal: "Agencia Zona 10" },
  { nombre: "VOLVO XC60 BLINDADO 2022 - 4024",          slug: "volvo-xc60-blindado-2022-4024",          codigo: "4024", placa: "P655LYU", precio: 485000, preciosiniva: 433036, kilometraje:  25000, motor: 2000, anio: 2022, traccion: "AWD", color_exterior: "Gris Thunder",         color_interior: "Blond",       transmision: "Automático", combustible: "Hibrido",   estado: "Disponible", marca: "VOLVO",     categoria: "Blindado",  sucursal: "Agencia Zona 10" },
  { nombre: "PORSCHE CAYENNE BLINDADO 2020 - 4025",     slug: "porsche-cayenne-blindado-2020-4025",     codigo: "4025", placa: "P766LZV", precio: 690000, preciosiniva: 616071, kilometraje:  45000, motor: 3000, anio: 2020, traccion: "AWD", color_exterior: "Blanco Carrara",       color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "PORSCHE",   categoria: "Blindado",  sucursal: "Agencia Zona 10" },

  // ── Paneles (2) ───────────────────────────────────────────────────────────────
  { nombre: "TOYOTA INNOVA 2023 - 3379",                slug: "toyota-innova-2023-3379",                codigo: "3379", placa: "P406KFF", precio: 147690, preciosiniva: 131866, kilometraje:  73514, motor: 2694, anio: 2023, traccion: "4x2", color_exterior: "Café Metálico",        color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Toyota",    categoria: "Panel",     sucursal: "Agencia Roosevelt" },
  { nombre: "JAC SUNRAY 2022 - 4026",                   slug: "jac-sunray-2022-4026",                   codigo: "4026", placa: "P877MAW", precio: 185000, preciosiniva: 165179, kilometraje:  62000, motor: 2800, anio: 2022, traccion: "4x2", color_exterior: "Blanco",               color_interior: "Gris",        transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "Jac",       categoria: "Panel",     sucursal: "Agencia Yurrita" },

  // ── Eléctricos SUV (2) ────────────────────────────────────────────────────────
  { nombre: "MG ZS EV 2024 - 4028",                     slug: "mg-zs-ev-2024-4028",                     codigo: "4028", placa: "P099MCY", precio: 265000, preciosiniva: 236607, kilometraje:   6500, motor: 0,    anio: 2024, traccion: "4x2", color_exterior: "Blanco Dover",         color_interior: "Negro",       transmision: "Automático", combustible: "Electrico", estado: "Disponible", marca: "MG",        categoria: "Suv",       sucursal: "Agencia Zona 10" },
  { nombre: "KIA EV6 4WD 2024 - 4029",                  slug: "kia-ev6-4wd-2024-4029",                  codigo: "4029", placa: "P200MDZ", precio: 425000, preciosiniva: 379464, kilometraje:   4100, motor: 0,    anio: 2024, traccion: "4WD", color_exterior: "Verde Yacht",          color_interior: "Negro",       transmision: "Automático", combustible: "Electrico", estado: "Reservado",  marca: "KIA",       categoria: "Suv",       sucursal: "Agencia Zona 10" },

  // ── Paneles adicionales (2) ──────────────────────────────────────────────
  { nombre: "CITROEN BERLINGO 2021 - 4040",             slug: "citroen-berlingo-2021-4040",             codigo: "4040", placa: "P512MNA", precio:  95000, preciosiniva:  84821, kilometraje:  89000, motor: 1600, anio: 2021, traccion: "4x2", color_exterior: "Blanco Banquise",      color_interior: "Gris",        transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "Citroen",   categoria: "Panel",     sucursal: "Agencia Roosevelt" },
  { nombre: "PEUGEOT PARTNER 2020 - 4041",              slug: "peugeot-partner-2020-4041",              codigo: "4041", placa: "P623MOB", precio:  88000, preciosiniva:  78571, kilometraje: 112000, motor: 1600, anio: 2020, traccion: "4x2", color_exterior: "Gris Aluminium",       color_interior: "Negro",       transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "Peugeot",   categoria: "Panel",     sucursal: "Agencia Yurrita" },

  // ── Marcas adicionales — SUVs ────────────────────────────────────────────
  { nombre: "LEXUS RX 350 2022 - 4031",                 slug: "lexus-rx-350-2022-4031",                 codigo: "4031", placa: "P734MPC", precio: 475000, preciosiniva: 424107, kilometraje:  19000, motor: 3500, anio: 2022, traccion: "AWD", color_exterior: "Blanco Eminent",       color_interior: "Cognac",      transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Lexus",     categoria: "Suv",       sucursal: "Agencia Zona 10" },
  { nombre: "AUDI Q3 SPORTBACK 2023 - 4032",            slug: "audi-q3-sportback-2023-4032",            codigo: "4032", placa: "P845MQD", precio: 365000, preciosiniva: 325893, kilometraje:  14500, motor: 1500, anio: 2023, traccion: "4x2", color_exterior: "Gris Chronos",         color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Audi",      categoria: "Suv",       sucursal: "Agencia Zona 10" },
  { nombre: "JAGUAR F-PACE 2021 - 4033",                slug: "jaguar-f-pace-2021-4033",                codigo: "4033", placa: "P956MRE", precio: 410000, preciosiniva: 366071, kilometraje:  36000, motor: 2000, anio: 2021, traccion: "AWD", color_exterior: "Firenze Red",          color_interior: "Ebony",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Jaguar",    categoria: "Suv",       sucursal: "Agencia Roosevelt" },
  { nombre: "SSANGYONG KORANDO 2022 - 4034",            slug: "ssangyong-korando-2022-4034",            codigo: "4034", placa: "P067MSF", precio: 155000, preciosiniva: 138393, kilometraje:  41000, motor: 1500, anio: 2022, traccion: "4x2", color_exterior: "Grand White",          color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "SsangYong", categoria: "Suv",       sucursal: "Agencia Yurrita" },
  { nombre: "SEAT ATECA 2021 - 4035",                   slug: "seat-ateca-2021-4035",                   codigo: "4035", placa: "P178MTG", precio: 185000, preciosiniva: 165179, kilometraje:  52000, motor: 1500, anio: 2021, traccion: "4x2", color_exterior: "Azul Indigo",          color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Seat",      categoria: "Suv",       sucursal: "Agencia Yurrita" },

  // ── Marcas adicionales — Sedanes ─────────────────────────────────────────
  { nombre: "LEXUS IS 300 2020 - 4036",                 slug: "lexus-is-300-2020-4036",                 codigo: "4036", placa: "P289MUH", precio: 320000, preciosiniva: 285714, kilometraje:  48000, motor: 2000, anio: 2020, traccion: "4x2", color_exterior: "Sonic Titanium",       color_interior: "Rioja Red",   transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Lexus",     categoria: "Sedán",     sucursal: "Agencia Zona 10" },
  { nombre: "AUDI A3 SEDAN 2022 - 4037",                slug: "audi-a3-sedan-2022-4037",                codigo: "4037", placa: "P390MVI", precio: 285000, preciosiniva: 254464, kilometraje:  27000, motor: 1500, anio: 2022, traccion: "4x2", color_exterior: "Negro Mythos",         color_interior: "Gris Perla",  transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Audi",      categoria: "Sedán",     sucursal: "Agencia Roosevelt" },
  { nombre: "PEUGEOT 301 2019 - 4038",                  slug: "peugeot-301-2019-4038",                  codigo: "4038", placa: "P401MWJ", precio:  72000, preciosiniva:  64286, kilometraje:  95000, motor: 1600, anio: 2019, traccion: "4x2", color_exterior: "Gris Shark",           color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Peugeot",   categoria: "Sedán",     sucursal: "Agencia Yurrita" },
  { nombre: "SEAT LEON 2021 - 4039",                    slug: "seat-leon-2021-4039",                    codigo: "4039", placa: "P512MXK", precio: 165000, preciosiniva: 147321, kilometraje:  39000, motor: 1500, anio: 2021, traccion: "4x2", color_exterior: "Rojo Desire",          color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Seat",      categoria: "Sedán",     sucursal: "Agencia Yurrita" },

  // ── Marcas adicionales — Hatchbacks ──────────────────────────────────────
  { nombre: "CITROEN C3 2023 - 4042",                   slug: "citroen-c3-2023-4042",                   codigo: "4042", placa: "P734MZM", precio:  85000, preciosiniva:  75893, kilometraje:  28000, motor: 1200, anio: 2023, traccion: "4x2", color_exterior: "Naranja Spring",       color_interior: "Negro",       transmision: "Manual",     combustible: "Gasolina",  estado: "Disponible", marca: "Citroen",   categoria: "Hatchback", sucursal: "Agencia Roosevelt" },
  { nombre: "PEUGEOT 208 ALLURE 2023 - 4043",           slug: "peugeot-208-allure-2023-4043",           codigo: "4043", placa: "P845NAN", precio: 125000, preciosiniva: 111607, kilometraje:  17000, motor: 1200, anio: 2023, traccion: "4x2", color_exterior: "Azul Vertigo",         color_interior: "Negro",       transmision: "Automático", combustible: "Gasolina",  estado: "Disponible", marca: "Peugeot",   categoria: "Hatchback", sucursal: "Agencia Zona 10" },

  // ── Marcas adicionales — Pickups ─────────────────────────────────────────
  { nombre: "JIM T8 4X4 2023 - 4044",                   slug: "jim-t8-4x4-2023-4044",                   codigo: "4044", placa: "P956NBO", precio: 145000, preciosiniva: 129464, kilometraje:  32000, motor: 2000, anio: 2023, traccion: "4x4", color_exterior: "Plata",                color_interior: "Negro",       transmision: "Manual",     combustible: "Diesel",    estado: "Disponible", marca: "JIM",       categoria: "Pickup",    sucursal: "Agencia Roosevelt" },
  { nombre: "SSANGYONG MUSSO 4X4 2022 - 4045",          slug: "ssangyong-musso-4x4-2022-4045",          codigo: "4045", placa: "P067NCP", precio: 195000, preciosiniva: 174107, kilometraje:  48000, motor: 2200, anio: 2022, traccion: "4x4", color_exterior: "Gris Gran",            color_interior: "Negro",       transmision: "Automático", combustible: "Diesel",    estado: "Disponible", marca: "SsangYong", categoria: "Pickup",    sucursal: "Agencia Yurrita" },

  // ── Híbridos adicionales ─────────────────────────────────────────────────
  { nombre: "LEXUS NX 350H HYBRID 2023 - 4046",         slug: "lexus-nx-350h-hybrid-2023-4046",         codigo: "4046", placa: "P178NDQ", precio: 510000, preciosiniva: 455357, kilometraje:  12000, motor: 2500, anio: 2023, traccion: "AWD", color_exterior: "Sonic Chrome",         color_interior: "Negro",       transmision: "Automático", combustible: "Hibrido",   estado: "Disponible", marca: "Lexus",     categoria: "Hybrid",    sucursal: "Agencia Zona 10" },
  { nombre: "VOLVO XC40 RECHARGE HYBRID 2023 - 4047",   slug: "volvo-xc40-recharge-hybrid-2023-4047",   codigo: "4047", placa: "P289NER", precio: 380000, preciosiniva: 339286, kilometraje:  15000, motor: 1500, anio: 2023, traccion: "4x2", color_exterior: "Fjord Blue",           color_interior: "Blond",       transmision: "Automático", combustible: "Hibrido",   estado: "Disponible", marca: "VOLVO",     categoria: "Hybrid",    sucursal: "Agencia Yurrita" },

  // ── Vehículos con estados variados ───────────────────────────────────────
  { nombre: "JAGUAR E-PACE 2020 - 4048",                slug: "jaguar-e-pace-2020-4048",                codigo: "4048", placa: "P390NFS", precio: 295000, preciosiniva: 263393, kilometraje:  58000, motor: 2000, anio: 2020, traccion: "AWD", color_exterior: "Santorini Black",      color_interior: "Ebony",       transmision: "Automático", combustible: "Gasolina",  estado: "Reservado",    marca: "Jaguar",    categoria: "Suv",       sucursal: "Agencia Zona 10" },
  { nombre: "AUDI Q5 HYBRID 2023 - 4049",               slug: "audi-q5-hybrid-2023-4049",               codigo: "4049", placa: "P401NGT", precio: 495000, preciosiniva: 441964, kilometraje:  10000, motor: 2000, anio: 2023, traccion: "AWD", color_exterior: "Gris Daytona",         color_interior: "Negro",       transmision: "Automático", combustible: "Hibrido",   estado: "Facturado",  marca: "Audi",      categoria: "Hybrid",    sucursal: "Agencia Zona 10" },
  { nombre: "CHANGAN UNI-T 2024 - 4050",                slug: "changan-uni-t-2024-4050",                codigo: "4050", placa: "P512NHU", precio: 175000, preciosiniva: 156250, kilometraje:   5500, motor: 1500, anio: 2024, traccion: "4x2", color_exterior: "Blanco Glaciar",       color_interior: "Negro Rojo",  transmision: "Automático", combustible: "Gasolina",  estado: "Reservado",  marca: "Changan",   categoria: "Suv",       sucursal: "Agencia Roosevelt" },
];

const TRACCION_MAP: Record<string, Traccion> = {
  "4x4": Traccion.T4X4,
  "4x2": Traccion.T4X2,
  "AWD": Traccion.AWD,
  "4WD": Traccion.T4WD,
};

const TRANSMISION_MAP: Record<string, Transmision> = {
  "Automático": Transmision.Automatico,
  Manual:       Transmision.Manual,
};

const ESTADO_MAP: Record<string, EstadoVenta> = {
  Disponible: EstadoVenta.Disponible,
  Reservado:  EstadoVenta.Reservado,
  Facturado:  EstadoVenta.Facturado,
};

const COMBUSTIBLE_MAP: Record<string, Combustible> = {
  Gasolina:  Combustible.Gasolina,
  Diesel:    Combustible.Diesel,
  Hibrido:   Combustible.Hibrido,
  Electrico: Combustible.Electrico,
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
  let updated = 0;
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

    const combustible = COMBUSTIBLE_MAP[v.combustible];

    if (!combustible) {
      console.warn(`  [vehiculos] ${v.placa} — combustible inválido (${v.combustible}) — omitido.`);
      omitted++;
      continue;
    }

    const existing = await prisma.vehiculo.findUnique({
      where: { placa: v.placa },
      select: { id: true },
    });

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
      transmision:    TRANSMISION_MAP[v.transmision] ?? Transmision.Manual,
      combustible,
      estado:         ESTADO_MAP[v.estado] ?? EstadoVenta.Disponible,
      descripcion:    `Vehículo ${v.nombre} en excelente estado, con ${v.kilometraje.toLocaleString()} km recorridos. Transmisión ${v.transmision.toLowerCase()}, motor ${v.motor} cc, tracción ${v.traccion}. Color exterior ${v.color_exterior.toLowerCase()}, interior ${v.color_interior.toLowerCase()}. Disponible en ${v.sucursal}.`,
      marcaId,
      categoriaId,
      sucursalId,
    };

    await prisma.vehiculo.upsert({
      where:  { placa: v.placa },
      create: data,
      update: data,
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  console.log(
    `  [vehiculos] Creados: ${created} | Actualizados: ${updated} | Omitidos: ${omitted}`
  );
}
