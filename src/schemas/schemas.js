import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";

const JoiPassword = Joi.extend(joiPasswordExtendCore);

const schemas = {
  userSchema: Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().min(1).email().required(),
    password: JoiPassword.string()
      .min(8)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
    confirmPassword: Joi.ref("password"),
  }).unknown(false),

  signinSchema: Joi.object({
    email: Joi.string().min(1).email().required(),
    password: JoiPassword.string()
      .min(8)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  }).unknown(false),

  idSchema: Joi.object({
    id: Joi.number().integer().required(),
  }),

  urlSchema: Joi.object({
    url: Joi.string().uri().required(),
  }),
};

export { schemas };