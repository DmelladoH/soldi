ALTER TABLE `monthly_report_investment` ADD `monthly_report_id` integer NOT NULL REFERENCES monthly_report(id);--> statement-breakpoint
ALTER TABLE `monthly_report` DROP COLUMN `investment_id`;