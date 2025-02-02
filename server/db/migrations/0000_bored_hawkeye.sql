CREATE TABLE `fund_entity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`isin` text(12) NOT NULL,
	`name` text(256) NOT NULL,
	`type` text(256) NOT NULL,
	`currency` text(3) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fund_entity_isin_unique` ON `fund_entity` (`isin`);--> statement-breakpoint
CREATE UNIQUE INDEX `fund_entity_name_unique` ON `fund_entity` (`name`);--> statement-breakpoint
CREATE TABLE `monthly_report_investment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fund_entity_id` integer,
	`current_value` integer NOT NULL,
	`amount_invested` integer NOT NULL,
	FOREIGN KEY (`fund_entity_id`) REFERENCES `fund_entity`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `monthly_report` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`payroll` integer NOT NULL,
	`cash` text NOT NULL,
	`additional_income` text NOT NULL,
	`investment_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`investment_id`) REFERENCES `monthly_report_investment`(`id`) ON UPDATE no action ON DELETE no action
);
