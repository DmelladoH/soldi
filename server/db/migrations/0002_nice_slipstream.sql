CREATE TABLE `cash_report` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`amount` integer NOT NULL,
	`currency` text(3) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monthly_report_additional_income` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monthly_report_id` integer NOT NULL,
	`additional_income_report_id` integer NOT NULL,
	FOREIGN KEY (`monthly_report_id`) REFERENCES `monthly_report`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`additional_income_report_id`) REFERENCES `cash_report`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `monthly_report_cash` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monthly_report_id` integer NOT NULL,
	`cash_report_id` integer NOT NULL,
	FOREIGN KEY (`monthly_report_id`) REFERENCES `monthly_report`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cash_report_id`) REFERENCES `cash_report`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `monthly_report_investment` ADD `currency` text(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report` ADD `currency` text(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report` DROP COLUMN `cash`;--> statement-breakpoint
ALTER TABLE `monthly_report` DROP COLUMN `additional_income`;