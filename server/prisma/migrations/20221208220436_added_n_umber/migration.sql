/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Unit` ADD COLUMN `number` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Department_name_key` ON `Department`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Unit_number_key` ON `Unit`(`number`);
