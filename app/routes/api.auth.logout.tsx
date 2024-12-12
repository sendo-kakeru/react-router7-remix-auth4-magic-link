import { redirect, type ActionFunctionArgs } from "react-router";
import { sessionStorage } from "~/features/auth/session-storage.server";

export async function action({ request }: ActionFunctionArgs) {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}
