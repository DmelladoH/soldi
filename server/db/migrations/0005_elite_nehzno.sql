CREATE TABLE `monthly_report_movements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monthly_report_id` integer NOT NULL,
	`type` text NOT NULL,
	`category` text(256) NOT NULL,
	`name` text(256) NOT NULL,
	`amount` integer NOT NULL,
	`currency` text(3) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`monthly_report_id`) REFERENCES `monthly_report`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `monthly_report_additional_income`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_monthly_report_investment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monthly_report_id` integer NOT NULL,
	`fund_entity_id` integer NOT NULL,
	`current_value` integer NOT NULL,
	`amount_invested` integer NOT NULL,
	`currency` text(3) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`monthly_report_id`) REFERENCES `monthly_report`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fund_entity_id`) REFERENCES `fund_entity`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_monthly_report_investment`("id", "monthly_report_id", "fund_entity_id", "current_value", "amount_invested", "currency", "created_at") SELECT "id", "monthly_report_id", "fund_entity_id", "current_value", "amount_invested", "currency", "created_at" FROM `monthly_report_investment`;--> statement-breakpoint
DROP TABLE `monthly_report_investment`;--> statement-breakpoint
ALTER TABLE `__new_monthly_report_investment` RENAME TO `monthly_report_investment`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `monthly_report` DROP COLUMN `payroll`;--> statement-breakpoint
ALTER TABLE `monthly_report` DROP COLUMN `expences`;--> statement-breakpoint
ALTER TABLE `monthly_report` DROP COLUMN `currency`;