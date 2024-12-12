import { env } from "env.server";
import prisma from "../prisma.server";
import { createMagicLinkInstances } from "libs/magic-link";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env.MAIL_ADDRESS,
    pass: env.MAIL_PASSWORD,
  },
});

const { sendToken, emailLinkStrategy } = createMagicLinkInstances({
  secret: env.CRYPTO_SECRET,
  sendEmail: async ({ email, magicLink }) => {
    transporter.sendMail({
      from: `Auth <${env.MAIL_ADDRESS}>`,
      to: email,
      subject: "ログインメール",
      html: `
      <div style="max-width:600px;margin:0 auto;text-align:center;">
        <p>
          このメールはログインするためのメールです。
          <br>
          ログインを完了するには、以下のボタンをクリックしてください
        </p>
        <a href="${magicLink}" style="margin:24px auto;background:rgb(0,111,238);color:rgb(255,255,255);display:inline-block;border-radius:12px;width:240px;padding:10px 16px;align-items:center;justify-content:center;text-decoration:none;font-weight:bold;font-size:0.875rem;">
          ログイン
        </a>
        <p>または、下記のURLをコピーしてブラウザの新しいタブに貼り付けてください</p>
        <p><a href="${magicLink}" style="text-align:start;">${magicLink}</a></p>
        </div>`,
    });
  },
  verify: async ({ email }) => {
    const me = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (me) {
      if (!me.isActive) {
        throw new Error("アカウントが無効です。");
      }
      return me;
    } else {
      return prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
        },
      });
    }
  },
});

export { sendToken, emailLinkStrategy };
