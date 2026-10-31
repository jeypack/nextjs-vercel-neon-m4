/*
  Warnings:

  - You are about to drop the column `packageUnit` on the `PantryItem` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `PantryItem` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `ShoppingItem` table. All the data in the column will be lost.
  - Added the required column `unitId` to the `PantryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `ShoppingItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('WEIGHT', 'VOLUME', 'COUNT', 'OTHER');

-- AlterTable
ALTER TABLE "PantryItem" DROP COLUMN "packageUnit",
DROP COLUMN "unit",
ADD COLUMN     "packageUnitId" INTEGER,
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "unit",
ADD COLUMN     "unitId" INTEGER;

-- AlterTable
ALTER TABLE "ShoppingItem" DROP COLUMN "unit",
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" "UnitType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_symbol_key" ON "Unit"("symbol");

-- CreateIndex
CREATE INDEX "Unit_type_sortOrder_idx" ON "Unit"("type", "sortOrder");

-- CreateIndex
CREATE INDEX "RecipeIngredient_unitId_idx" ON "RecipeIngredient"("unitId");

-- CreateIndex
CREATE INDEX "ShoppingItem_unitId_idx" ON "ShoppingItem"("unitId");

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryItem" ADD CONSTRAINT "PantryItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryItem" ADD CONSTRAINT "PantryItem_packageUnitId_fkey" FOREIGN KEY ("packageUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
