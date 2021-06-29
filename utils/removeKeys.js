import { handleError } from "../config/requestHandler";

export const removeKeys = async (obj, ...args) => {
	try {
		for (let i of Object.keys(obj)) {
			if (args.includes(i)) delete obj[i];
		}
		return obj;
	} catch (error) {
		return handleError({ res, error, data: error });
	}
};
