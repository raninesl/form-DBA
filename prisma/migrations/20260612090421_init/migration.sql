-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "studyLevel" TEXT NOT NULL,
    "desiredProgram" TEXT NOT NULL,
    "lastDiploma" TEXT,
    "message" TEXT,
    "cvUrl" TEXT,
    "diplomaUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
