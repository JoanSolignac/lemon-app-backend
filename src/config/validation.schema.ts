import * as Joi from 'joi';

export const validationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    DB_URL: Joi.string().uri().required(),
})