import { registerAs } from "@nestjs/config";

export const APP_CONFIG = registerAs('app', () => ({
    port: process.env.PORT,
}));