-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "smsReminderDaysBefore" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "smsRemindersEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "units" ADD COLUMN     "reminderSentForRenewalDate" TIMESTAMP(3);
