CREATE TABLE `movement_tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`type` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `movement_tag_name_unique` ON `movement_tag` (`name`);--> statement-breakpoint
ALTER TABLE `monthly_report_movements` ADD `tag_id` integer NOT NULL REFERENCES movement_tag(id);--> statement-breakpoint
ALTER TABLE `monthly_report_movements` ADD `description` text(256);--> statement-breakpoint
ALTER TABLE `monthly_report_movements` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `monthly_report_movements` DROP COLUMN `name`;