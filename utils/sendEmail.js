import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMailHtml = async (reciever, source, subject, content) => {
	try {
		const data = {
			to: reciever,
			from: source,
			subject,
			html: content,
		};
		return sgMail.send(data);
	} catch (err) {
		return err;
	}
};
