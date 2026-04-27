import { registerAs } from "@nestjs/config";

export const DATABASE_CONFIG = registerAs('database', () => ({
    url: process.env.DATABASE_URL,
}));