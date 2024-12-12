import type { User } from "@prisma/client";
import {
  SendToken,
  type SendEmailFunction,
  type VerifyEmailFunction,
} from "./src/sendToken";
import { EmailLinkStrategy } from "./src/strategy";
import type { Strategy } from "remix-auth/strategy";

export function createMagicLinkInstances({
  secret = "",
  emailFieldKey,
  sendEmail,
  sessionMagicLinkKey,
  sessionEmailKey,
  callbackURL,
  magicLinkSearchParamKey,
  verifyEmailAddress,
  linkExpirationTime,
  validateSessionMagicLink,
  verify,
}: {
  secret?: string;
  emailFieldKey?: string;
  sendEmail: SendEmailFunction;
  sessionMagicLinkKey?: string;
  sessionEmailKey?: string;
  callbackURL?: string;
  magicLinkSearchParamKey?: string;
  verifyEmailAddress?: VerifyEmailFunction;
  linkExpirationTime?: number;
  validateSessionMagicLink?: boolean;
  verify: Strategy.VerifyFunction<User, EmailLinkStrategy.VerifyOptions>;
}) {
  const emailLinkStrategy = new EmailLinkStrategy<User>(
    {
      secret,
      emailFieldKey,
      linkExpirationTime,
      validateSessionMagicLink,
    },
    verify
  );
  const sendToken = new SendToken({
    secret,
    emailFieldKey,
    sendEmail,
    sessionMagicLinkKey,
    sessionEmailKey,
    callbackURL,
    magicLinkSearchParamKey,
    verifyEmailAddress,
  });

  return { emailLinkStrategy, sendToken };
}
