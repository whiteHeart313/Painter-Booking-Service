import Joi from 'joi';

export const createAvailabilitySchema = Joi.object({
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().required(),
});

export const createBookingRequestSchema = Joi.object({
  requestedStart: Joi.string().isoDate().required(),
  requestedEnd: Joi.string().isoDate().required(),
  description: Joi.string().optional(),
  address: Joi.string().required(),
  estimatedHours: Joi.number().integer().min(1).optional(),
});

export const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('USER', 'PAINTER').required(),
  address: Joi.string().optional(),
  phone: Joi.string().optional(),
});
