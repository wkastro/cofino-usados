-- CreateTable
CREATE TABLE `Transmision` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Transmision_nombre_key`(`nombre`),
    UNIQUE INDEX `Transmision_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Combustible` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Combustible_nombre_key`(`nombre`),
    UNIQUE INDEX `Combustible_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Traccion` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Traccion_nombre_key`(`nombre`),
    UNIQUE INDEX `Traccion_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoVenta` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EstadoVenta_nombre_key`(`nombre`),
    UNIQUE INDEX `EstadoVenta_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Rename old enum columns and add new enum columns with DEFAULT for existing rows
-- Step 1: Add new *_enum columns with temporary defaults (copy from existing columns)
ALTER TABLE `Vehiculo`
    ADD COLUMN `estado_enum` ENUM('Disponible', 'Reservado', 'Facturado') NOT NULL DEFAULT 'Disponible',
    ADD COLUMN `transmision_enum` ENUM('Automático', 'Manual') NOT NULL DEFAULT 'Manual',
    ADD COLUMN `combustible_enum` ENUM('Gasolina', 'Diesel', 'Híbrido', 'Eléctrico') NOT NULL DEFAULT 'Gasolina',
    ADD COLUMN `traccion_enum` ENUM('4x4', '4x2', 'AWD', '4WD') NOT NULL DEFAULT '4x2';

-- Step 2: Copy data from old columns into new columns
UPDATE `Vehiculo` SET
    `estado_enum` = `estado`,
    `transmision_enum` = `transmision`,
    `combustible_enum` = `combustible`,
    `traccion_enum` = `traccion`;

-- Step 3: Add new nullable FK columns
ALTER TABLE `Vehiculo`
    ADD COLUMN `transmisionId` CHAR(36) NULL,
    ADD COLUMN `combustibleId` CHAR(36) NULL,
    ADD COLUMN `traccionId` CHAR(36) NULL,
    ADD COLUMN `estadoId` CHAR(36) NULL;

-- Step 4: Drop old enum columns
ALTER TABLE `Vehiculo`
    DROP COLUMN `estado`,
    DROP COLUMN `transmision`,
    DROP COLUMN `combustible`,
    DROP COLUMN `traccion`;

-- Step 5: Remove temporary defaults from new enum columns
ALTER TABLE `Vehiculo`
    MODIFY COLUMN `estado_enum` ENUM('Disponible', 'Reservado', 'Facturado') NOT NULL,
    MODIFY COLUMN `transmision_enum` ENUM('Automático', 'Manual') NOT NULL,
    MODIFY COLUMN `combustible_enum` ENUM('Gasolina', 'Diesel', 'Híbrido', 'Eléctrico') NOT NULL,
    MODIFY COLUMN `traccion_enum` ENUM('4x4', '4x2', 'AWD', '4WD') NOT NULL;

-- CreateIndex
CREATE INDEX `Vehiculo_combustibleId_idx` ON `Vehiculo`(`combustibleId`);

-- CreateIndex
CREATE INDEX `Vehiculo_transmisionId_idx` ON `Vehiculo`(`transmisionId`);

-- CreateIndex
CREATE INDEX `Vehiculo_traccionId_idx` ON `Vehiculo`(`traccionId`);

-- CreateIndex
CREATE INDEX `Vehiculo_estadoId_idx` ON `Vehiculo`(`estadoId`);

-- CreateIndex
CREATE INDEX `Vehiculo_estadoId_precio_idx` ON `Vehiculo`(`estadoId`, `precio`);

-- CreateIndex
CREATE INDEX `Vehiculo_estadoId_categoriaId_idx` ON `Vehiculo`(`estadoId`, `categoriaId`);

-- CreateIndex
CREATE INDEX `Vehiculo_estadoId_marcaId_idx` ON `Vehiculo`(`estadoId`, `marcaId`);

-- CreateIndex
CREATE INDEX `Vehiculo_estadoId_combustibleId_idx` ON `Vehiculo`(`estadoId`, `combustibleId`);

-- CreateIndex
CREATE INDEX `Vehiculo_estadoId_transmisionId_idx` ON `Vehiculo`(`estadoId`, `transmisionId`);

-- CreateIndex
CREATE INDEX `Vehiculo_estadoId_traccionId_idx` ON `Vehiculo`(`estadoId`, `traccionId`);

-- CreateIndex
CREATE INDEX `Vehiculo_categoriaId_combustibleId_idx` ON `Vehiculo`(`categoriaId`, `combustibleId`);

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_transmisionId_fkey` FOREIGN KEY (`transmisionId`) REFERENCES `Transmision`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_combustibleId_fkey` FOREIGN KEY (`combustibleId`) REFERENCES `Combustible`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_traccionId_fkey` FOREIGN KEY (`traccionId`) REFERENCES `Traccion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `EstadoVenta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
