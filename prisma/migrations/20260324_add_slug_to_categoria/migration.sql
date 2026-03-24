-- AlterTable: add slug column (nullable first for backfill)
ALTER TABLE `Categoria` ADD COLUMN `slug` VARCHAR(191) NULL;

-- Backfill: generate slug from nombre (lowercase, spaces/special chars to hyphens, remove accents)
UPDATE `Categoria` SET `slug` = LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(TRIM(`nombre`), ' ', '-'),
        'á', 'a'),
      'é', 'e'),
    'ó', 'o')
);

-- Make slug NOT NULL and add unique constraint
ALTER TABLE `Categoria` MODIFY COLUMN `slug` VARCHAR(191) NOT NULL;
CREATE UNIQUE INDEX `Categoria_slug_key` ON `Categoria`(`slug`);
