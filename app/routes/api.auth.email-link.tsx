import { redirect, type LoaderFunctionArgs } from "react-router";
import * as v from "valibot";
import { sendToken } from "~/features/auth/email-link-strategy.server";
import { sessionStorage } from "~/features/auth/session-storage.server";

export async function action({ request }: LoaderFunctionArgs) {
  try {
    return sendToken.send(request, sessionStorage, {
      successRedirect: "/login",
    });
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error(
        "メールアドレスの形式が正しくありません",
        "apps/app/routes/api.auth.email-link.tsx",
        error,
      );
      throw redirect("/login");
    }
    throw error;
  }
}
