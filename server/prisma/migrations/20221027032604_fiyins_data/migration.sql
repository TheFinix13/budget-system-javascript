/*
  Warnings:

  - You are about to drop the column `email` on the `ministry` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ministry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Ministry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sector` to the `Ministry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ministry` DROP COLUMN `email`,
    DROP COLUMN `type`,
    ADD COLUMN `sector` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ministryId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `departmentId` INTEGER NULL,

    UNIQUE INDEX `Unit_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Ministry_name_key` ON `Ministry`(`name`);

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_ministryId_fkey` FOREIGN KEY (`ministryId`) REFERENCES `Ministry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
