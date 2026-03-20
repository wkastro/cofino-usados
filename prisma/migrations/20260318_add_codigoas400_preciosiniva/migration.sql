-- AlterTable
ALTER TABLE `Sucursal` ADD COLUMN `codigoAs400` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Vehiculo` ADD COLUMN `preciosiniva` DECIMAL(12, 2) NOT NULL,
    MODIFY `estado` ENUM('DISPONIBLE', 'RESERVADO', 'FACTURADO') NOT NULL DEFAULT 'DISPONIBLE';

-- CreateIndex
CREATE UNIQUE INDEX `Sucursal_codigoAs400_key` ON `Sucursal`(`codigoAs400`);
