-- AlterTable
ALTER TABLE `users` ADD COLUMN `email` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `username` VARCHAR(255) NOT NULL DEFAULT '';
