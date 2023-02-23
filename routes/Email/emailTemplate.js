
const sendEmail = async ({ heading, paragraph, link, subject, linkTag, email }) => {
  console.log(heading, paragraph, link, subject, email)
  require('dotenv').config()
  const nodemailer = require('nodemailer');
  let smtpTransport = require('nodemailer-smtp-transport');


  let htmll = `<!DOCTYPE html>
      <html>
        <head>
          <title></title>
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
            @media screen and (min-width: 100px) and (max-width: 800px) {
              #main{
                width:100%
                
              }
              /* Styles for screens with a width between 768px and 1024px */
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
              <h1>${heading}</h1>
              <p>
                ${paragraph}
              </p>
              <a href=${link} class="verification-button"
                >${linkTag}</a
              >
            </div>
            <div class="footer">
              <p>
                If it was not you or you have any other concerns,
                please contact us at support@bookmycounsel.com
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
        user: 'bookmycounsel247@gmail.com',
        pass: process.env.GOOGLE_APP_PASSWORD_MAIL
      }
    }));
    console.log('fine in 48', email, subject)
    const mailOptions = {
      from: 'bookmycounsel247@gmail.com',
      to: email,
      subject: subject,
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
      } else if (response) {
        console.log(response, 'response')
      }
    });
  }

  sendOtpEmail()

}

module.exports = sendEmail