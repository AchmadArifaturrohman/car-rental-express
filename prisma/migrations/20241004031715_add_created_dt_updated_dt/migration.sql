/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cars" ALTER COLUMN "updated_dt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "created_by" VARCHAR,
ADD COLUMN     "created_dt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" VARCHAR,
ADD COLUMN     "updated_dt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "created_dt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_dt" TIMESTAMP(3);
