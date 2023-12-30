/*
  Warnings:

  - Made the column `ministryId` on table `department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departmentId` on table `unit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_ministryId_fkey`;

-- DropForeignKey
ALTER TABLE `unit` DROP FOREIGN KEY `Unit_departmentId_fkey`;

-- AlterTable
ALTER TABLE `department` MODIFY `ministryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `unit` MODIFY `departmentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_ministryId_fkey` FOREIGN KEY (`ministryId`) REFERENCES `Ministry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
