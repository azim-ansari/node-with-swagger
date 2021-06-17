import joi from "joi";

const schema = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  status: joi.string(),
  dob: joi.string(),
  profilePic: joi.string(),
});

module.exports = schema;
