ALTER TABLE `users` DROP INDEX `users_username_unique`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `phone` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_phone_unique` UNIQUE(`phone`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `role`;