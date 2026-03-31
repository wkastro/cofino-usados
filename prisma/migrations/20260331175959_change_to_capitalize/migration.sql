/*
  Warnings:

  - You are about to alter the column `estado` on the `Vehiculo` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.
  - The values [AUTOMATICO,MANUAL] on the enum `Vehiculo_transmision` will be removed. If these variants are still used in the database, this will fail.
  - The values [GASOLINA,DIESEL,HIBRIDO,ELECTRICO] on the enum `Vehiculo_combustible` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Vehiculo` MODIFY `estado` ENUM('Disponible', 'Reservado', 'Facturado', 'Vendido') NOT NULL DEFAULT 'Disponible',
    MODIFY `transmision` ENUM('Automático', 'Manual') NOT NULL,
    MODIFY `combustible` ENUM('Gasolina', 'Diesel', 'Híbrido', 'Eléctrico') NOT NULL;
