/*
  Warnings:

  - You are about to drop the column `tipoVehiculoId` on the `Vehiculo` table. All the data in the column will be lost.
  - You are about to drop the `Etiqueta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoVehiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehiculoEtiqueta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehiculoImagen` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoriaId` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Vehiculo` DROP FOREIGN KEY `Vehiculo_tipoVehiculoId_fkey`;

-- DropForeignKey
ALTER TABLE `VehiculoEtiqueta` DROP FOREIGN KEY `VehiculoEtiqueta_etiquetaId_fkey`;

-- DropForeignKey
ALTER TABLE `VehiculoEtiqueta` DROP FOREIGN KEY `VehiculoEtiqueta_vehiculoId_fkey`;

-- DropForeignKey
ALTER TABLE `VehiculoImagen` DROP FOREIGN KEY `VehiculoImagen_vehiculoId_fkey`;

-- DropIndex
DROP INDEX `Vehiculo_tipoVehiculoId_combustible_idx` ON `Vehiculo`;

-- DropIndex
DROP INDEX `Vehiculo_tipoVehiculoId_idx` ON `Vehiculo`;

-- AlterTable
ALTER TABLE `Vehiculo` DROP COLUMN `tipoVehiculoId`,
    ADD COLUMN `categoriaId` CHAR(36) NOT NULL;

-- DropTable
DROP TABLE `Etiqueta`;

-- DropTable
DROP TABLE `TipoVehiculo`;

-- DropTable
DROP TABLE `VehiculoEtiqueta`;

-- DropTable
DROP TABLE `VehiculoImagen`;

-- CreateTable
CREATE TABLE `EtiquetaComercial` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EtiquetaComercial_nombre_key`(`nombre`),
    UNIQUE INDEX `EtiquetaComercial_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehiculoEtiquetaComercial` (
    `vehiculoId` CHAR(36) NOT NULL,
    `etiquetaId` CHAR(36) NOT NULL,

    INDEX `VehiculoEtiquetaComercial_etiquetaId_idx`(`etiquetaId`),
    INDEX `VehiculoEtiquetaComercial_vehiculoId_idx`(`vehiculoId`),
    PRIMARY KEY (`vehiculoId`, `etiquetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Galeria` (
    `id` CHAR(36) NOT NULL,
    `vehiculoId` CHAR(36) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Galeria_vehiculoId_idx`(`vehiculoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Vehiculo_categoriaId_idx` ON `Vehiculo`(`categoriaId`);

-- CreateIndex
CREATE INDEX `Vehiculo_categoriaId_combustible_idx` ON `Vehiculo`(`categoriaId`, `combustible`);

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehiculoEtiquetaComercial` ADD CONSTRAINT `VehiculoEtiquetaComercial_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehiculoEtiquetaComercial` ADD CONSTRAINT `VehiculoEtiquetaComercial_etiquetaId_fkey` FOREIGN KEY (`etiquetaId`) REFERENCES `EtiquetaComercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Galeria` ADD CONSTRAINT `Galeria_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
