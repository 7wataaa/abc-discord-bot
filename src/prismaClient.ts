import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL ?? process.env.DEV_DATABASE_URL,
    },
  },
});

console.log(process.env.DATABASE_URL);
