const generateotp = async (email, hash, name) => {
  const nodemailer = require('nodemailer');
  const jwt = require('jsonwebtoken')
  let smtpTransport = require('nodemailer-smtp-transport');
  require('dotenv').config()

  //generating verify token
  let emailVarifyToken = jwt.sign({ email, hash, name }, process.env.EMAILVARIFICATION, { expiresIn: 60 * 10 })

  let varfLink = `https://jungle-green-colt-cape.cyclic.app/emailverify?token=${emailVarifyToken}`
  let htmll = `<!DOCTYPE html>
    <html>
      <head>
        <title>Email Verification for SchedulMeet</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          #main {
            width: 45%;
            margin: auto;
          }
          
          .header {
            width: 20%;
            text-align: center;
            display: flex;
            margin: auto;
            margin-bottom: 20px;
            margin-top: 20px;
          }
          img {
            width: 100%;
          }
    
          .content {
            text-align: center;
            background-color: antiquewhite;
            padding: 20px;
          }
    
          .verification-button {
            background-color: #4caf50; /* Green */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            font-family: "Open Sans", sans-serif;
          }
    
          .footer {
            background-color: antiquewhite;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            font-family: "Open Sans", sans-serif;
          }
          /* Add your CSS styles here */
          /* Use a font that looks professional */
          /* Use colors that match your brand */
        </style>
      </head>
      <body>
        <div id="main">
          <div class="header">
            <img src="cid:unique@kreata.ee" alt="SchedulMeet Logo" />
          </div>
          <div class="content">
            <h1>Welcome ${name} to SchedulMeet!</h1>
            <p>
              Thank you for signing up. To complete your registration, please click
              on the button below to verify your email address.
            </p>
            <a href=${varfLink} class="verification-button"
              >Verify Email</a
            >
          </div>
          <div class="footer">
            <p>
              If you did not sign up for SchedulMeet or have any other concerns,
              please contact us at support@schedulmeet.com
            </p>
          </div>
        </div>
      </body>
    </html>
    `

  const sendOtpEmail = async () => {
    console.log(email, 'this is email');
    console.log('find in 40');
    smtpTransport = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: 'adrianlamo001.eluminati.co@gmail.com',
        pass: 'rqonssndnnmnjkjc'
      }
    }));
    console.log('fine in 48')
    const mailOptions = {
      from: 'adrianlamo001.eluminati.co@gmail.com',
      to: email,
      subject: 'test subject',
      text: 'https://google.com ',
      html: htmll,
      attachments: [{
        filename: 'logo.jpg',
        path: __dirname + '/logo.jpg',
        cid: 'unique@kreata.ee' //same cid value as in the html img src
      }]
    }

    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log('error while sending mail', error);
      }
    });
  }

  sendOtpEmail()

}

module.exports = generateotp