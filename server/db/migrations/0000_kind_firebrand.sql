CREATE TABLE `fund_entity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`isin` text(12) NOT NULL,
	`name` text(256) NOT NULL,
	`type` text(256) NOT NULL,
	`currency` text(3) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`isin` text(12) NOT NULL,
	`current_amount` integer NOT NULL,
	`currency` text(3) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
