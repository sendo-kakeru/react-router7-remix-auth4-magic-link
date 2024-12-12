import { redirect, type LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/features/auth/authenticator.server";
import { sessionStorage } from "~/features/auth/session-storage.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const session = await sessionStorage.getSession(request.headers.get("cookie"));
    const magicLink = session.get("auth:magiclink");
    const user = await authenticator.authenticate(
      "email-link",
      new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: magicLink,
      }),
    );
    session.unset("auth:magiclink");
    session.unset("auth:email");
    session.set("me", user);
    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    console.error("ログインに失敗しました。", error);
    return redirect("/login");
  }
}
