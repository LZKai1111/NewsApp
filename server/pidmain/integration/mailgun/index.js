const emailConfig = require('../../config/mailgun')
const mailgun = require('mailgun-js')(emailConfig);

function sendEmail(recipient, message, attachment = false) {
  new Promise((resolve, reject) => {
    const data = {
      from: emailConfig.from,
      to: recipient,
      subject: message.subject,
      text: message.text,
      inline: attachment,
      html: message.html,
    };
    try {
      mailgun.messages().send(data, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = {
	sendEmail,
}