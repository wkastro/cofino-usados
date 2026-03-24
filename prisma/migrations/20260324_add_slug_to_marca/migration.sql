-- AlterTable: add slug column (nullable first for backfill)
ALTER TABLE `Marca` ADD COLUMN `slug` VARCHAR(191) NULL;

-- Backfill: generate slug from nombre (lowercase, spaces/special chars to hyphens)
UPDATE `Marca` SET `slug` = LOWER(REPLACE(REPLACE(REPLACE(TRIM(`nombre`), ' ', '-'), '.', ''), ',', ''));

-- Make slug NOT NULL and add unique constraint
ALTER TABLE `Marca` MODIFY COLUMN `slug` VARCHAR(191) NOT NULL;
CREATE UNIQUE INDEX `Marca_slug_key` ON `Marca`(`slug`);
