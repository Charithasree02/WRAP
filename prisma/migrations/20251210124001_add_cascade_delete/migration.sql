-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_wrapId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_wrapId_fkey";

-- DropForeignKey
ALTER TABLE "SecretMessage" DROP CONSTRAINT "SecretMessage_wrapId_fkey";

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretMessage" ADD CONSTRAINT "SecretMessage_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
