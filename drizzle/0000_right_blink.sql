CREATE TABLE `login_attempts` (
	`id` varchar(36) NOT NULL,
	`attempt_key` varchar(64) NOT NULL,
	`email` varchar(191) NOT NULL,
	`ip_address` varchar(64) NOT NULL,
	`failed_count` int NOT NULL DEFAULT 0,
	`first_failed_at` datetime NOT NULL,
	`last_failed_at` datetime NOT NULL,
	`locked_until` datetime,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `login_attempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `login_attempts_attempt_key_unique` UNIQUE(`attempt_key`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`full_name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('super_admin','admin','surveyor','finance') NOT NULL DEFAULT 'admin',
	`is_active` boolean NOT NULL DEFAULT true,
	`last_login_at` datetime,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
