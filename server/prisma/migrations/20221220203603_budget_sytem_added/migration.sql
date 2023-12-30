-- CreateTable
CREATE TABLE `Budget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `termId` INTEGER NOT NULL,
    `unitId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'created',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BudgetRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total_amount` DOUBLE NOT NULL,
    `termId` INTEGER NOT NULL,
    `ministryId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'created',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetRequest` ADD CONSTRAINT `BudgetRequest_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetRequest` ADD CONSTRAINT `BudgetRequest_ministryId_fkey` FOREIGN KEY (`ministryId`) REFERENCES `Ministry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
