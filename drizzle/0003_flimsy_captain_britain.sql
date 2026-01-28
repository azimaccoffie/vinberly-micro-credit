CREATE TABLE `customer_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`customerId` varchar(50) NOT NULL,
	`loanBalance` decimal(12,2) DEFAULT '0',
	`totalRepaid` decimal(12,2) DEFAULT '0',
	`nextPaymentDate` timestamp,
	`nextPaymentAmount` decimal(12,2),
	`interestRate` decimal(5,2) DEFAULT '0',
	`loanTerm` int,
	`paymentsCompleted` int DEFAULT 0,
	`totalPayments` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customer_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `customer_data_customerId_unique` UNIQUE(`customerId`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`documentType` varchar(100) NOT NULL,
	`documentUrl` varchar(500) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int NOT NULL,
	`verificationStatus` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`verificationNotes` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`verifiedAt` timestamp,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referralEmail` varchar(320) NOT NULL,
	`referralName` varchar(255) NOT NULL,
	`referralCode` varchar(50) NOT NULL,
	`status` enum('pending','completed','expired') NOT NULL DEFAULT 'pending',
	`rewardAmount` decimal(12,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
);
