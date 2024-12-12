import { createFileSessionStorage } from "@react-router/node";
import { env } from "env.server";
import { createCookie } from "react-router";

const EXPIRATION_DURATION_IN_SECONDS = 60 * 60 * 24 * 180;

const expires = new Date();
expires.setSeconds(expires.getSeconds() + EXPIRATION_DURATION_IN_SECONDS);

const sessionCookie = createCookie("auth_session", {
  secrets: [env.SESSION_SECRET!],
  sameSite: "lax",
  expires,
  httpOnly: true,
  secure: env.NODE_ENV === "production",
});

export const sessionStorage = createFileSessionStorage({
  cookie: sessionCookie,
  dir: "./sessions",
});
