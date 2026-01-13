CREATE TABLE `booking_cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cart_id` int NOT NULL,
	`treatment_id` int NOT NULL,
	`date` varchar(20) NOT NULL,
	`time` varchar(10) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `booking_cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_carts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `booking_carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` timestamp DEFAULT (now());