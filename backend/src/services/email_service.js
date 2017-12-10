const nodemailer = require('nodemailer');
const render = require('co-render');
const ses = require('node-ses');

let transporter;

async function pretendSendEmail(firstName, lastName, email, points) {
  try {
    if (!transporter) {
      const response = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: response.user, // generated ethereal user
              pass: response.pass  // generated ethereal password
          }
      });
    }
    let mailOptions = {
      from: '"Rob Elsner" <rob@eschewobfuscation.com>',
      to: `"${firstName} ${lastName} <${email}>"`,
      subject: '✔ Points update!',
      text: `${firstName} ${lastName} you have ${points}!`, // plain text body
      html: await render(
        require('path').resolve(__dirname, '../templates/points_email.ejs'),
        {engine: 'ejs', firstName, lastName, points })
    };
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e);
    return false;
  }
}

let sesClient ;

async function sendSESEmail(firstName, lastName, email, points) {
  if(!sesClient) {
    const client = ses.createClient({key: process.env.SES_KEY, secret: process.env.SES_SECRET});
    sesClient = (...params) => {
      return new Promise(function (resolve, reject) {
        client.sendEmail(...params, function(err, data, res) {
          if (err) reject(err);
          resolve(data);
        });
      });
    }
  }
  let mailOptions = {
    from: `noreply@${process.env.SES_DOMAIN}`,
    to: email,
    subject: '✔ Points update!',
    altText: `${firstName} ${lastName} you have ${points}!`, // plain text body
    message: await render(
      require('path').resolve(__dirname, '../templates/points_email.ejs'),
      {engine: 'ejs', firstName, lastName, points })
  };
  return await sesClient(mailOptions);
}

async function sendEmail(firstName, lastName, email, points)  {
  if (process.env.SES_KEY) {
    return sendSESEmail(firstName, lastName, email, points);
  }
  return pretendSendEmail(firstName, lastName, email, points);
}

module.exports = {
  sendEmail
}
