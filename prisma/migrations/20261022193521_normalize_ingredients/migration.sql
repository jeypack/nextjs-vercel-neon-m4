/*
  Warnings:

  - You are about to drop the column `name` on the `PantryItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ShoppingItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipeId,ingredientId]` on the table `RecipeIngredient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ingredientId` to the `PantryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `ShoppingItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PantryItem_userId_name_idx";

-- DropIndex
DROP INDEX "RecipeIngredient_recipeId_idx";

-- DropIndex
DROP INDEX "ShoppingItem_userId_name_idx";

-- AlterTable
ALTER TABLE "PantryItem" DROP COLUMN "name",
ADD COLUMN     "ingredientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "name",
ADD COLUMN     "ingredientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingItem" DROP COLUMN "name",
ADD COLUMN     "ingredientId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "IngredientCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngredientCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IngredientCategory_name_key" ON "IngredientCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientCategory_slug_key" ON "IngredientCategory"("slug");

-- CreateIndex
CREATE INDEX "IngredientCategory_sortOrder_name_idx" ON "IngredientCategory"("sortOrder", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE INDEX "Ingredient_categoryId_name_idx" ON "Ingredient"("categoryId", "name");

-- CreateIndex
CREATE INDEX "PantryItem_userId_ingredientId_idx" ON "PantryItem"("userId", "ingredientId");

-- CreateIndex
CREATE INDEX "RecipeIngredient_ingredientId_idx" ON "RecipeIngredient"("ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_ingredientId_key" ON "RecipeIngredient"("recipeId", "ingredientId");

-- CreateIndex
CREATE INDEX "ShoppingItem_userId_ingredientId_idx" ON "ShoppingItem"("userId", "ingredientId");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IngredientCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryItem" ADD CONSTRAINT "PantryItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
