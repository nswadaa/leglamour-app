CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`review` varchar(1000) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `staff_availability` MODIFY COLUMN `is_available` int DEFAULT 0;