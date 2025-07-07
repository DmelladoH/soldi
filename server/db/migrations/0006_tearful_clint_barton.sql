ALTER TABLE `monthly_report` ADD `month` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report` ADD `year` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_report` DROP COLUMN `date`;