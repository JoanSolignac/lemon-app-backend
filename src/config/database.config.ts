import { registerAs } from "@nestjs/config";

export const databaseConfig = registerAs('database', () => ({
    url: process.env.DB_URL,
}))