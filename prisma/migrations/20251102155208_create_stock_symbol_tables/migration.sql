-- CreateTable
CREATE TABLE `StockSymbol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'validated', 'invalid') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` INTEGER NULL,

    UNIQUE INDEX `StockSymbol_symbol_key`(`symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockSymbol` ADD CONSTRAINT `StockSymbol_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
