-- CreateTable
CREATE TABLE `PageContent` (
    `id` CHAR(36) NOT NULL,
    `pageSlug` VARCHAR(191) NOT NULL,
    `blockKey` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PageContent_pageSlug_idx`(`pageSlug`),
    UNIQUE INDEX `PageContent_pageSlug_blockKey_key`(`pageSlug`, `blockKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
