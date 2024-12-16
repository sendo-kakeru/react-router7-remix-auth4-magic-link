import {
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useHref,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import { Button, Card, CardBody, NextUIProvider } from "@nextui-org/react";
import type { Route } from "./+types/root";
import stylesheet from "./styles/app.css?url";
import type React from "react";
import { sessionStorage } from "./features/auth/session-storage.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const me = session.get("me");
  return { me };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider navigate={navigate} useHref={useHref}>
          {children}
        </NextUIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  return (
    <div className="flex flex-col gap-4 items-center mx-auto w-full max-w-[800px] py-10 px-4 h-svh">
      <Card className="w-full">
        <CardBody className="items-center">
          {loaderData.me ? (
            <div className="flex items-center gap-8">
              <p>
                ようこそ <b className="text-xl">{loaderData.me.name}</b> さん
              </p>
              <Form action="/api/auth/logout" method="POST">
                <Button type="submit" color="primary" radius="full" className="w-fit">
                  ログアウト
                </Button>
              </Form>
            </div>
          ) : (
            <Button color="primary" radius="full" to="/login" as={Link} className="w-fit">
              ログイン
            </Button>
          )}
        </CardBody>
      </Card>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
