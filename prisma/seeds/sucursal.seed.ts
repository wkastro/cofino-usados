import { PrismaClient } from "../../generated/prisma/client";

const sucursales = [
  {
    nombre: 'Agencia Arrazola',
    direccion: 'Km. 17.5 Carretera a El Salvador',
    latitud: 14.537022,
    longitud: -90.457721,
    maps: 'https://goo.gl/maps/2M17JauZkkSfvQ6o7',
    waze: 'https://www.waze.com/es/live-map/directions?to=ll.14.64937017%2C-90.737038&from=place.ChIJM9gH28ikiYURPQ4ANbqjp2g&utm_medium=lm_share_directions&utm_campaign=default&utm_source=waze_website',
    estado: false, // i
  },
  {
    nombre: 'Agencia Yurrita',
    direccion: 'Ruta 6, 9-18, Zona 4, Guatemala',
    latitud: 14.617539,
    longitud: -90.516030,
    maps: 'https://goo.gl/maps/fs1VaotNA8xE5Qhw6',
    waze: 'https://www.waze.com/es/live-map/directions?to=ll.14.64937017%2C-90.737038&from=place.ChIJ-ergRTKiiYURc8Z5kes5PTA&utm_medium=lm_share_directions&utm_campaign=default&utm_source=waze_website',
    estado: true, // a
  },
  {
    nombre: 'Agencia Roosevelt',
    direccion: 'Km. 14 Calzada Roosevelt, 5-25 Zona 3 de Mixco, Guatemala',
    latitud: 14.634693,
    longitud: -90.584479,
    maps: 'https://goo.gl/maps/9WPSVxKmA6MBJUacA',
    waze: 'https://www.waze.com/es/live-map/directions?to=ll.14.64937017%2C-90.737038&from=place.ChIJ56LPIAehiYUR7O5N4RTX_JY&utm_medium=lm_share_directions&utm_campaign=default&utm_source=waze_website',
    estado: true,
  },
  {
    nombre: 'Lexus Semi Nuevos,  Zona 5',
    direccion: '10ma avenida 31-71 zona 5',
    latitud: 14.61989095523921,
    longitud: -90.51234936983906,
    maps: 'https://www.google.com/maps/dir//Cofi%C3%B1o+Stahl+S.+A.,+Cdad.+de+Guatemala/@14.6192265,-90.5420897,14z/data=!4m9!4m8!1m0!1m5!1m1!1s0x8589a2315057604f:0x5845ee6f9ad8af00!2m2!1d-90.5123748!2d14.6178293!3e0?entry=ttu',
    waze: 'https://ul.waze.com/ul?ll=14.61775181%2C-90.51290274&navigate=yes&zoom=17&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location',
    estado: false,
  },
  {
    nombre: 'Agencia Zona 10',
    direccion: '10 avenida 15-10, zona 10',
    latitud: 14.594766,
    longitud: -90.507622,
    maps: 'https://maps.google.com/?q=14.594766,-90.507622',
    waze: 'https://waze.com/ul/h9fxeh2yke',
    estado: true,
  },
];

export async function seedSucursales(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const sucursal of sucursales) {
    const existing = await prisma.sucursal.findUnique({
      where: { nombre: sucursal.nombre },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.sucursal.create({ data: sucursal });
    created++;
  }

  console.log(
    `  [sucursales] Creadas: ${created} | Omitidas (ya existían): ${skipped}`
  );
}
