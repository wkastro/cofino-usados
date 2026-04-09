-- Normalize existing data before removing enum value
UPDATE `Vehiculo`
SET `estado` = 'Reservado'
WHERE `estado` = 'Vendido';

-- Remove "Vendido" from allowed values
ALTER TABLE `Vehiculo`
  MODIFY `estado` ENUM('Disponible', 'Reservado', 'Facturado') NOT NULL DEFAULT 'Disponible';
