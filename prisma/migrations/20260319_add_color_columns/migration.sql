-- AlterTable: agregar columnas de color (nullable)
ALTER TABLE `Vehiculo`
  ADD COLUMN `color_interior` VARCHAR(191) NULL,
  ADD COLUMN `color_exterior` VARCHAR(191) NULL;
