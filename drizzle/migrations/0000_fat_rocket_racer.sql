CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`staff_id` int NOT NULL,
	`service_id` int NOT NULL,
	`date` date NOT NULL,
	`time` time NOT NULL,
	`status` enum('pending','waiting_payment','paid','cancelled') DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`method` varchar(50) NOT NULL,
	`amount` int NOT NULL,
	`payment_status` enum('pending','success','failed') DEFAULT 'pending',
	`transaction_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`price` int NOT NULL,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`role` varchar(20) DEFAULT 'user',
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
