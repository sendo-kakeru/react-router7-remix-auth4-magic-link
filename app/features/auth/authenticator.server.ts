import { Authenticator } from "remix-auth";
import { emailLinkStrategy } from "./email-link-strategy.server";
import type { User } from "@prisma/client";

const authenticator = new Authenticator<User>();
authenticator.use(emailLinkStrategy);
export { authenticator };
