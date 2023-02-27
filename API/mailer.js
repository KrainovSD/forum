import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config({ path: "environment.env", silent: true });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.POST_LOGIN,
    pass: process.env.POST_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmailWithLink = async (email, title, text, path, key) => {
  const message = {
    from: process.env.POST_LOGIN || "",
    to: email,
    subject: title,
    text: `${text}: https://${process.env.HOST}/${path}/${key}`,
    html: `${text}: <a href="https://${process.env.HOST}/${path}/${key}">Перейти</a> `,
  };
  await transporter.sendMail(message);
};
export const sendEmailWithMessage = async (email, title, text) => {
  const message = {
    from: process.env.POST_LOGIN || "",
    to: email,
    subject: title,
    text: `${text}`,
    html: `${text}`,
  };
  await transporter.sendMail(message);
};
