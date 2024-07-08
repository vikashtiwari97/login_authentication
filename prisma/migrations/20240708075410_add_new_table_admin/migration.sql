-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "full_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "hashedRT" TEXT,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);
