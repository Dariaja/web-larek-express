import { celebrate, Joi, Segments } from 'celebrate';

export const validateProduct = celebrate(
  {
    [Segments.BODY]: Joi.object({
      title: Joi.string()
        .min(2)
        .max(30)
        .required(),

      image: Joi.object({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      })
        .unknown(false)
        .required(),

      category: Joi.string().required(),

      description: Joi.string()
        .allow('')
        .optional(),

      price: Joi.number()
        .allow(null)
        .optional(),
    })
      .unknown(false)
      .required(),
  },
  {
    abortEarly: false,
    convert: false,
  },
);

export const validateOrder = celebrate(
  {
    [Segments.BODY]: Joi.object({
      payment: Joi.string()
        .valid('card', 'online')
        .required(),

      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

      phone: Joi.string()
        .pattern(/\S/)
        .required(),

      address: Joi.string()
        .pattern(/\S/)
        .required(),

      total: Joi.number().required(),

      items: Joi.array()
        .items(
          Joi.string()
            .pattern(/^[a-f\d]{24}$/i)
            .required(),
        )
        .min(1)
        .required(),
    })
      .unknown(false)
      .required(),
  },
  {
    abortEarly: false,
    convert: false,
  },
);
