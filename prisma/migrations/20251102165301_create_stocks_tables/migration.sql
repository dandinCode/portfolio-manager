-- CreateTable
CREATE TABLE `Stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `symbolId` INTEGER NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `sector` VARCHAR(191) NOT NULL,
    `dividendYield` DOUBLE NOT NULL,
    `volatility` DOUBLE NOT NULL,
    `lastFetchedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_symbolId_fkey` FOREIGN KEY (`symbolId`) REFERENCES `StockSymbol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
