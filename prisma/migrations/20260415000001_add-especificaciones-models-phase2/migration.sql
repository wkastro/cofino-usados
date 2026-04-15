-- Phase 2: Finalize especificaciones models
-- Make FK columns NOT NULL (all rows already have values from backfill in phase 1)
-- Drop temporary enum columns

-- Step 1: Drop old FK constraints (they have ON DELETE SET NULL, incompatible with NOT NULL)
ALTER TABLE `Vehiculo` DROP FOREIGN KEY `Vehiculo_transmisionId_fkey`;
ALTER TABLE `Vehiculo` DROP FOREIGN KEY `Vehiculo_combustibleId_fkey`;
ALTER TABLE `Vehiculo` DROP FOREIGN KEY `Vehiculo_traccionId_fkey`;
ALTER TABLE `Vehiculo` DROP FOREIGN KEY `Vehiculo_estadoId_fkey`;

-- Step 2: Make FK columns NOT NULL (all rows already have values from backfill)
ALTER TABLE `Vehiculo`
    MODIFY COLUMN `transmisionId` CHAR(36) NOT NULL,
    MODIFY COLUMN `combustibleId` CHAR(36) NOT NULL,
    MODIFY COLUMN `traccionId` CHAR(36) NOT NULL,
    MODIFY COLUMN `estadoId` CHAR(36) NOT NULL;

-- Step 3: Re-add FK constraints with RESTRICT (appropriate for NOT NULL FKs)
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_transmisionId_fkey` FOREIGN KEY (`transmisionId`) REFERENCES `Transmision`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_combustibleId_fkey` FOREIGN KEY (`combustibleId`) REFERENCES `Combustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_traccionId_fkey` FOREIGN KEY (`traccionId`) REFERENCES `Traccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `EstadoVenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 4: Drop old temporary enum columns
ALTER TABLE `Vehiculo`
    DROP COLUMN `estado_enum`,
    DROP COLUMN `transmision_enum`,
    DROP COLUMN `combustible_enum`,
    DROP COLUMN `traccion_enum`;
