// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nodemailer from 'nodemailer';
import auth from '../../config/mail';

let transporter;

export default async (req, res) => {
  const { name, to, subject, content } = req.body;

  if (!name || !to || !subject || !content) {
    return res.status(400).json({ error: 'Validation fails.' });
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    port: auth.MAIL_PORT,
    auth: {
      user: auth.MAIL_USER,
      pass: auth.MAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `${name} <mailsender@gmail.com>`,
      to,
      subject,
      text: content,
    });

    return res.json(info);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal error.' });
  }
};
