-- ============================================================
-- AUDITORÍA: Índices, constraints e integridad referencial
-- ============================================================

-- 1. Índices NextAuth (Account y Session)
CREATE INDEX `Account_userId_idx` ON `Account`(`userId`);
CREATE INDEX `Session_userId_idx` ON `Session`(`userId`);
CREATE INDEX `Session_expires_idx` ON `Session`(`expires`);

-- 2. Unique constraints en catálogos
ALTER TABLE `Marca`     ADD UNIQUE INDEX `Marca_nombre_key`(`nombre`);
ALTER TABLE `Sucursal`  ADD UNIQUE INDEX `Sucursal_nombre_key`(`nombre`);
ALTER TABLE `Categoria` ADD UNIQUE INDEX `Categoria_nombre_key`(`nombre`);

-- 3. motor: VARCHAR → INT (normalizar espacios primero)
UPDATE `Vehiculo` SET `motor` = TRIM(`motor`);
ALTER TABLE `Vehiculo` MODIFY `motor` INT NOT NULL;

-- 4. Nuevos índices en Vehiculo
CREATE INDEX `Vehiculo_estado_idx`            ON `Vehiculo`(`estado`);
CREATE INDEX `Vehiculo_codigo_idx`            ON `Vehiculo`(`codigo`);
CREATE INDEX `Vehiculo_estado_precio_idx`     ON `Vehiculo`(`estado`, `precio`);
CREATE INDEX `Vehiculo_estado_categoriaId_idx` ON `Vehiculo`(`estado`, `categoriaId`);
CREATE INDEX `Vehiculo_estado_marcaId_idx`    ON `Vehiculo`(`estado`, `marcaId`);
CREATE INDEX `Vehiculo_estado_combustible_idx` ON `Vehiculo`(`estado`, `combustible`);
CREATE INDEX `Vehiculo_estado_transmision_idx` ON `Vehiculo`(`estado`, `transmision`);
CREATE INDEX `Vehiculo_estado_traccion_idx`   ON `Vehiculo`(`estado`, `traccion`);

-- 5. Eliminar índice redundante en junction table
DROP INDEX `VehiculoEtiquetaComercial_vehiculoId_idx` ON `VehiculoEtiquetaComercial`;

-- 6. Galeria: cambiar FK a onDelete CASCADE
ALTER TABLE `Galeria` DROP FOREIGN KEY `Galeria_vehiculoId_fkey`;
ALTER TABLE `Galeria` ADD CONSTRAINT `Galeria_vehiculoId_fkey`
  FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
