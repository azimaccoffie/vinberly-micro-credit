CREATE TABLE `loan_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`businessType` varchar(100) NOT NULL,
	`businessDescription` text,
	`loanAmount` decimal(12,2) NOT NULL,
	`loanPurpose` varchar(255) NOT NULL,
	`status` enum('pending','approved','rejected','processing') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loan_applications_id` PRIMARY KEY(`id`)
);
