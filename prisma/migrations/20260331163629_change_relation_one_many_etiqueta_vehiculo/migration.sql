/*
  Warnings:

  - You are about to drop the `VehiculoEtiquetaComercial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `VehiculoEtiquetaComercial` DROP FOREIGN KEY `VehiculoEtiquetaComercial_etiquetaId_fkey`;

-- DropForeignKey
ALTER TABLE `VehiculoEtiquetaComercial` DROP FOREIGN KEY `VehiculoEtiquetaComercial_vehiculoId_fkey`;

-- AlterTable
ALTER TABLE `Vehiculo` ADD COLUMN `etiquetaComercialId` CHAR(36) NULL;

-- DropTable
DROP TABLE `VehiculoEtiquetaComercial`;

-- CreateIndex
CREATE INDEX `Vehiculo_etiquetaComercialId_idx` ON `Vehiculo`(`etiquetaComercialId`);

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_etiquetaComercialId_fkey` FOREIGN KEY (`etiquetaComercialId`) REFERENCES `EtiquetaComercial`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
