-- Remove preciosiniva column and add preciodescuento (nullable) to Vehiculo
ALTER TABLE `Vehiculo` DROP COLUMN `preciosiniva`;
ALTER TABLE `Vehiculo` ADD COLUMN `preciodescuento` DECIMAL(12, 2) NULL;
