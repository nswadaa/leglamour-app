CREATE TABLE `time_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`time` time NOT NULL,
	`is_active` int DEFAULT 1,
	CONSTRAINT `time_slots_id` PRIMARY KEY(`id`)
);
