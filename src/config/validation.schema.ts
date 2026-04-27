import * as Joi from 'joi';

export const VALIDATION_SCHEMA = Joi.object({
    PORT: Joi
        .number()
        .default(3000),

    DATABASE_URL: Joi
        .string()
        .uri()
        .required(),

    JWT_SECRET: Joi
        .string()
        .min(32)
        .required(),

    JWT_EXPIRES_IN: Joi
        .string()
        .pattern(/^\d+(s|m|h|d)$/)
        .default('1h'),
});