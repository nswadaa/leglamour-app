CREATE TABLE `dp_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` int NOT NULL,
	CONSTRAINT `dp_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `service_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_availability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`date` date NOT NULL,
	`is_available` int DEFAULT 1,
	CONSTRAINT `staff_availability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `status` enum('pending','waiting_payment','waiting_approval','paid','cancelled') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `payment_status` enum('pending','waiting_approval','success','failed') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `bookings` ADD `dp_amount` int DEFAULT 20000;--> statement-breakpoint
ALTER TABLE `services` ADD `category_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `duration` int DEFAULT 60;--> statement-breakpoint
ALTER TABLE `staff` ADD `role` enum('owner','senior','junior') NOT NULL;--> statement-breakpoint
ALTER TABLE `staff` ADD `is_active` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `category`;