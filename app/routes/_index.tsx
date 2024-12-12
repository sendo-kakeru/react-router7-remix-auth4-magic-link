import { Card, CardBody, CardHeader, Divider, Link } from "@nextui-org/react";
import { Link as RRLink } from "react-router";

export default function Page() {
  return (
    <Card className="w-full px-4">
      <CardHeader className="text-xl font-bold">トップページ</CardHeader>
      <Divider />
      <CardBody>
        <Link to="/login" as={RRLink}>
          ログイン
        </Link>
      </CardBody>
    </Card>
  );
}
