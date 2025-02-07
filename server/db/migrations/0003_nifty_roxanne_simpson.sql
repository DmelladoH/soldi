DROP TABLE `cash_report`;--> statement-breakpoint
ALTER TABLE `monthly_report_additional_income` ADD `name` text(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_additional_income` ADD `amount` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_additional_income` ADD `currency` text(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_additional_income` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_additional_income` DROP COLUMN `additional_income_report_id`;--> statement-breakpoint
ALTER TABLE `monthly_report_cash` ADD `name` text(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_cash` ADD `amount` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_cash` ADD `currency` text(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_cash` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report_cash` DROP COLUMN `cash_report_id`;--> statement-breakpoint
ALTER TABLE `monthly_report_investment` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;