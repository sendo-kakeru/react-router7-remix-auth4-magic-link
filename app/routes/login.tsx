import { sessionStorage } from "~/features/auth/session-storage.server";
import { Form, Link as RRLink, type LoaderFunctionArgs } from "react-router";
import { Button, Card, CardBody, CardHeader, Divider, Input, Link } from "@nextui-org/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const me = session.get("me");
  return { me, isMagicLinkSent: session.get("auth:magiclink") };
}

export default function Login({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  return (
    <Card className="w-full px-4">
      <CardHeader className="text-xl font-bold">ログインページ</CardHeader>
      <Divider />
      <CardBody className="pt-10">
        {loaderData.me ? (
          <div className="w-full flex flex-col items-center gap-4">
            <p>ログイン済みです。</p>
            <Button color="primary" radius="full" to="/" as={RRLink} className="w-fit">
              トップへ戻る
            </Button>
          </div>
        ) : (
          <>
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
                className="w-full flex flex-col items-center gap-4"
              >
                <Input type="text" name="email" variant="bordered" label="メールアドレス" />
                <Button type="submit" color="primary" radius="full" className="w-fit">
                  ログイン
                </Button>
              </Form>
            )}
            <div className="mt-16">
              <Link to="/" as={RRLink}>
                トップページへ
              </Link>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
