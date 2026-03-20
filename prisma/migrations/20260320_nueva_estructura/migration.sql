-- ================================================================
-- Migración: Estructura nueva (Categoria, EtiquetaComercial, Galeria)
-- ================================================================

-- 1. Expandir enums para agregar nuevos valores sin perder datos
ALTER TABLE `Vehiculo`
  MODIFY `estado`      ENUM('DISPONIBLE','RESERVADO','FACTURADO','VENDIDO') NOT NULL DEFAULT 'DISPONIBLE',
  MODIFY `transmision` ENUM('AUTOMATICO','MECANICO','MANUAL') NOT NULL,
  MODIFY `combustible` ENUM('GASOLINA','DIESEL','HIBRIDO','ELECTRICO') NOT NULL;

-- 2. Migrar datos: MECANICO → MANUAL
UPDATE `Vehiculo` SET `transmision` = 'MANUAL' WHERE `transmision` = 'MECANICO';

-- 3. Eliminar MECANICO del enum
ALTER TABLE `Vehiculo`
  MODIFY `transmision` ENUM('AUTOMATICO','MANUAL') NOT NULL;

-- 4. Eliminar FK que apunta a TipoVehiculo
ALTER TABLE `Vehiculo` DROP FOREIGN KEY `Vehiculo_tipoVehiculoId_fkey`;

-- 5. Eliminar índices que usan tipoVehiculoId
DROP INDEX `Vehiculo_tipoVehiculoId_combustible_idx` ON `Vehiculo`;
DROP INDEX `Vehiculo_tipoVehiculoId_idx` ON `Vehiculo`;

-- 6. Renombrar tabla TipoVehiculo → Categoria (preserva todos los datos)
RENAME TABLE `TipoVehiculo` TO `Categoria`;

-- 7. Renombrar columna tipoVehiculoId → categoriaId
ALTER TABLE `Vehiculo` CHANGE COLUMN `tipoVehiculoId` `categoriaId` CHAR(36) NOT NULL;

-- 8. Recrear índices con el nuevo nombre de columna
CREATE INDEX `Vehiculo_categoriaId_idx`            ON `Vehiculo`(`categoriaId`);
CREATE INDEX `Vehiculo_categoriaId_combustible_idx` ON `Vehiculo`(`categoriaId`, `combustible`);

-- 9. Agregar índices de estado (parte de audit_fixes que nunca se aplicó)
CREATE INDEX `Vehiculo_estado_idx`            ON `Vehiculo`(`estado`);
CREATE INDEX `Vehiculo_codigo_idx`            ON `Vehiculo`(`codigo`);
CREATE INDEX `Vehiculo_estado_precio_idx`     ON `Vehiculo`(`estado`, `precio`);
CREATE INDEX `Vehiculo_estado_categoriaId_idx` ON `Vehiculo`(`estado`, `categoriaId`);
CREATE INDEX `Vehiculo_estado_marcaId_idx`    ON `Vehiculo`(`estado`, `marcaId`);
CREATE INDEX `Vehiculo_estado_combustible_idx` ON `Vehiculo`(`estado`, `combustible`);
CREATE INDEX `Vehiculo_estado_transmision_idx` ON `Vehiculo`(`estado`, `transmision`);
CREATE INDEX `Vehiculo_estado_traccion_idx`   ON `Vehiculo`(`estado`, `traccion`);

-- 10. Restaurar FK apuntando a la tabla renombrada
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_categoriaId_fkey`
  FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 11. Crear tabla EtiquetaComercial
CREATE TABLE `EtiquetaComercial` (
    `id`        CHAR(36)     NOT NULL,
    `nombre`    VARCHAR(191) NOT NULL,
    `slug`      VARCHAR(191) NOT NULL,
    `estado`    BOOLEAN      NOT NULL DEFAULT true,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    UNIQUE INDEX `EtiquetaComercial_nombre_key`(`nombre`),
    UNIQUE INDEX `EtiquetaComercial_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 12. Crear tabla VehiculoEtiquetaComercial (junction)
CREATE TABLE `VehiculoEtiquetaComercial` (
    `vehiculoId` CHAR(36) NOT NULL,
    `etiquetaId` CHAR(36) NOT NULL,

    INDEX `VehiculoEtiquetaComercial_etiquetaId_idx`(`etiquetaId`),
    PRIMARY KEY (`vehiculoId`, `etiquetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `VehiculoEtiquetaComercial`
  ADD CONSTRAINT `VehiculoEtiquetaComercial_vehiculoId_fkey`
    FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `VehiculoEtiquetaComercial_etiquetaId_fkey`
    FOREIGN KEY (`etiquetaId`) REFERENCES `EtiquetaComercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 13. Crear tabla Galeria y migrar datos desde VehiculoImagen
CREATE TABLE `Galeria` (
    `id`         CHAR(36)     NOT NULL,
    `vehiculoId` CHAR(36)     NOT NULL,
    `url`        VARCHAR(191) NOT NULL,
    `orden`      INTEGER      NOT NULL DEFAULT 0,
    `createdAt`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3)  NOT NULL,

    INDEX `Galeria_vehiculoId_idx`(`vehiculoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrar imágenes existentes
INSERT INTO `Galeria` (`id`, `vehiculoId`, `url`, `orden`, `createdAt`, `updatedAt`)
SELECT `id`, `vehiculoId`, `url`, `orden`, `createdAt`, `updatedAt` FROM `VehiculoImagen`;

-- Eliminar FK y tabla VehiculoImagen
ALTER TABLE `VehiculoImagen` DROP FOREIGN KEY `VehiculoImagen_vehiculoId_fkey`;
DROP TABLE `VehiculoImagen`;

-- Agregar FK en Galeria con CASCADE
ALTER TABLE `Galeria` ADD CONSTRAINT `Galeria_vehiculoId_fkey`
  FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
