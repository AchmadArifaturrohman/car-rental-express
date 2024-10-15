-- DropForeignKey
ALTER TABLE "access" DROP CONSTRAINT "access_role_id_fkey";

-- AddForeignKey
ALTER TABLE "access" ADD CONSTRAINT "access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
