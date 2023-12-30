-- CreateTable
CREATE TABLE `Expenditure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `termId` INTEGER NOT NULL,
    `unitId` INTEGER NOT NULL,
    `budgetRequestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expenditure` ADD CONSTRAINT `Expenditure_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expenditure` ADD CONSTRAINT `Expenditure_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expenditure` ADD CONSTRAINT `Expenditure_budgetRequestId_fkey` FOREIGN KEY (`budgetRequestId`) REFERENCES `BudgetRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
