/*
  Warnings:

  - The values [MECANICO] on the enum `Vehiculo_transmision` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Vehiculo` MODIFY `estado` ENUM('VENDIDO', 'DISPONIBLE', 'RESERVADO', 'FACTURADO') NOT NULL DEFAULT 'DISPONIBLE',
    MODIFY `transmision` ENUM('AUTOMATICO', 'MANUAL') NOT NULL,
    MODIFY `combustible` ENUM('GASOLINA', 'DIESEL', 'HIBRIDO', 'ELECTRICO') NOT NULL;

-- CreateTable
CREATE TABLE `Etiqueta` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Etiqueta_nombre_key`(`nombre`),
    UNIQUE INDEX `Etiqueta_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehiculoEtiqueta` (
    `vehiculoId` CHAR(36) NOT NULL,
    `etiquetaId` CHAR(36) NOT NULL,

    INDEX `VehiculoEtiqueta_etiquetaId_idx`(`etiquetaId`),
    INDEX `VehiculoEtiqueta_vehiculoId_idx`(`vehiculoId`),
    PRIMARY KEY (`vehiculoId`, `etiquetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VehiculoEtiqueta` ADD CONSTRAINT `VehiculoEtiqueta_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehiculoEtiqueta` ADD CONSTRAINT `VehiculoEtiqueta_etiquetaId_fkey` FOREIGN KEY (`etiquetaId`) REFERENCES `Etiqueta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
