/*
  Warnings:

  - Added the required column `departmentId` to the `Expenditure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expenditure` ADD COLUMN `departmentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Expenditure` ADD CONSTRAINT `Expenditure_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
