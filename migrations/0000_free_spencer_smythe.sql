CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`fullname` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`access_policy` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `user_addresses` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`province` integer NOT NULL,
	`province_name` text NOT NULL,
	`district` integer NOT NULL,
	`district_name` text NOT NULL,
	`ward` integer NOT NULL,
	`ward_name` text NOT NULL,
	`detail` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
