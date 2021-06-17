import bcrypt from "bcryptjs";

exports.comparePassword = (dbPassword, userPassword) => {
  return bcrypt.compare(userPassword, dbPassword);
};
