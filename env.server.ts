import * as v from "valibot";

const ServerEnvSchema = v.object({
  NODE_ENV: v.union([v.literal("production"), v.literal("development"), v.literal("staging")]),
  DATABASE_URL: v.pipe(v.string(), v.url()),
  SESSION_SECRET: v.string(),
  CRYPTO_SECRET: v.string(),
  MAIL_ADDRESS: v.pipe(v.string(), v.email()),
  MAIL_PASSWORD: v.string(),
  MAIL_HOST: v.string(),
});

let env: v.InferOutput<typeof ServerEnvSchema>;
try {
  env = v.parse(ServerEnvSchema, process.env);
} catch (error) {
  if (error instanceof v.ValiError) {
    const invalidPaths = error.issues
      .map((issue) => "\t" + [issue.path?.[0].key, issue.message].join(": "))
      .join("\n");
    throw new Error(
      `Invalid environment variable values detected. Please check the following variables:
${invalidPaths}`,
      { cause: error },
    );
  }
  throw error;
}
export { env };
