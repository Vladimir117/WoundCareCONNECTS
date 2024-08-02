require('dotenv').config();

const postmark = require('postmark');

// Create a new postmark client with your server API token
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);

const sendSubmissionMailToAdmin = async (name) => {
  console.log(name);
  try {
    // Send email using Postmark client
    await client.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL,
      To: process.env.SUBMISSION_EMAIL_TO_ADMIN,
      Subject: 'New Submission from Patient',
      HtmlBody: `
        <p>A new submission has been submitted from patient <strong>${name}</strong>.</p>
      `,
      MessageStream: 'outbound' // Optional: Message stream for categorizing emails
    });

    console.log('Contact form message sent successfully');
  } catch (error) {
    console.error('Error sending contact form message:', error.message);
    throw new Error('Failed to send contact form message');
  }
};

module.exports = sendSubmissionMailToAdmin;
