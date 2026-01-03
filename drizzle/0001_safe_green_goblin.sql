CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(50),
	`phone` varchar(20),
	`password` varchar(100),
	`role` varchar(20) DEFAULT 'user',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
DROP TABLE `users_table`;