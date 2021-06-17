import joi from "joi";

const schema = joi.object().keys({
  title: joi.string().required(),
  description: joi.string(),
  createdBy: joi.string(),
});

module.exports = schema;
