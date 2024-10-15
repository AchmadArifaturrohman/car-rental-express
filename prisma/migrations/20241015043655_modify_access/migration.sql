-- AlterTable
ALTER TABLE "access" ADD COLUMN     "created_by" VARCHAR,
ADD COLUMN     "created_dt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" VARCHAR,
ADD COLUMN     "updated_dt" TIMESTAMP(3);
