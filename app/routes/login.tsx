import { sessionStorage } from "~/features/auth/session-storage.server";
import { Form, redirect, type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const me = session.get("me");
  if (me) {
    console.log("ログイン済み");
    throw redirect("/");
  }
  return {
    isMagicLinkSent: session.get("auth:magiclink"),
  };
}

export default function Login({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  return (
    <div className="">
      {loaderData.isMagicLinkSent ? (
        <div className="mt-8">
          <p className="text-xl font-bold text-center mb-6">ログインメールを送信しました。</p>
          <p className="mb-2">メール内のリンクをクリックしてログインしてください。</p>
          <p>リンクは30分間有効です。</p>
        </div>
      ) : (
        <Form
          action="/api/auth/email-link"
          method="post"
          className="w-full flex flex-col justify-center gap-4"
        >
          <input type="text" name="email" className="border" />
          <button type="submit" className="border">
            ログイン
          </button>
        </Form>
      )}
    </div>
  );
}
