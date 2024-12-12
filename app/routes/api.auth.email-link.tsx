import { redirect, type LoaderFunctionArgs } from "react-router";
import * as v from "valibot";
import { sendToken } from "~/features/auth/email-link-strategy.server";
import { sessionStorage } from "~/features/auth/session-storage.server";

export async function action({ request }: LoaderFunctionArgs) {
  try {
    return sendToken.send(request, sessionStorage, {
      redirect: "/login",
    });
  } catch (error) {
    console.error("メールの送信に失敗しました", error);
    if (error instanceof v.ValiError) {
      console.error("メールアドレスの形式が正しくありません", error);
    }
    return redirect("/login");
  }
}
