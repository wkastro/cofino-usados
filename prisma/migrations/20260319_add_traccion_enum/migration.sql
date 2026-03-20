-- AlterTable: agregar columna traccion como ENUM (con default temporal para filas existentes)
ALTER TABLE `Vehiculo`
  ADD COLUMN `traccion` ENUM('4x4', '4x2', 'AWD', '4WD') NOT NULL DEFAULT '4x2';

-- Eliminar el default (el schema no define uno)
ALTER TABLE `Vehiculo`
  ALTER COLUMN `traccion` DROP DEFAULT;

-- CreateIndex
CREATE INDEX `Vehiculo_traccion_idx` ON `Vehiculo`(`traccion`);
