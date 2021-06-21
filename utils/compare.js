import bcrypt from "bcryptjs";

export const comparePassword = (dbPassword, userPassword) => {
	return bcrypt.compare(userPassword, dbPassword);
};
