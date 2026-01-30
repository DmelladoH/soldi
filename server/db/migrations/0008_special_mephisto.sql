CREATE INDEX `idx_monthly_report_cash_report_id` ON `monthly_report_cash` (`monthly_report_id`);--> statement-breakpoint
CREATE INDEX `idx_monthly_report_investment_report_id` ON `monthly_report_investment` (`monthly_report_id`);--> statement-breakpoint
CREATE INDEX `idx_monthly_report_movements_report_id` ON `monthly_report_movements` (`monthly_report_id`);--> statement-breakpoint
CREATE INDEX `idx_monthly_report_year_month` ON `monthly_report` (`year`,`month`);