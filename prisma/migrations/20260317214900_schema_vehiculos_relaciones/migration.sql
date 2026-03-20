-- CreateTable
CREATE TABLE `Vehiculo` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NULL,
    `placa` VARCHAR(191) NOT NULL,
    `precio` DECIMAL(12, 2) NOT NULL,
    `kilometraje` INTEGER NOT NULL,
    `motor` VARCHAR(191) NULL,
    `anio` INTEGER NOT NULL,
    `estado` ENUM('DISPONIBLE', 'RESERVADO', 'VENDIDO', 'FACTURADO') NOT NULL DEFAULT 'DISPONIBLE',
    `sucursalId` CHAR(36) NOT NULL,
    `marcaId` CHAR(36) NOT NULL,
    `tipoVehiculoId` CHAR(36) NOT NULL,
    `transmision` ENUM('AUTOMATICO', 'MECANICO') NOT NULL,
    `combustible` ENUM('GASOLINA', 'DIESEL', 'ELECTRICO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehiculo_slug_key`(`slug`),
    UNIQUE INDEX `Vehiculo_placa_key`(`placa`),
    INDEX `Vehiculo_precio_idx`(`precio`),
    INDEX `Vehiculo_kilometraje_idx`(`kilometraje`),
    INDEX `Vehiculo_anio_idx`(`anio`),
    INDEX `Vehiculo_sucursalId_idx`(`sucursalId`),
    INDEX `Vehiculo_marcaId_idx`(`marcaId`),
    INDEX `Vehiculo_tipoVehiculoId_idx`(`tipoVehiculoId`),
    INDEX `Vehiculo_combustible_idx`(`combustible`),
    INDEX `Vehiculo_transmision_idx`(`transmision`),
    INDEX `Vehiculo_sucursalId_precio_idx`(`sucursalId`, `precio`),
    INDEX `Vehiculo_tipoVehiculoId_combustible_idx`(`tipoVehiculoId`, `combustible`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehiculoImagen` (
    `id` CHAR(36) NOT NULL,
    `vehiculoId` CHAR(36) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `VehiculoImagen_vehiculoId_idx`(`vehiculoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sucursal` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `latitud` DECIMAL(10, 7) NOT NULL,
    `longitud` DECIMAL(10, 7) NOT NULL,
    `maps` VARCHAR(191) NULL,
    `waze` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marca` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoVehiculo` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `Marca`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_tipoVehiculoId_fkey` FOREIGN KEY (`tipoVehiculoId`) REFERENCES `TipoVehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehiculoImagen` ADD CONSTRAINT `VehiculoImagen_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
