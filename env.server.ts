import * as v from "valibot";

const ServerEnvSchema = v.object({
  NODE_ENV: v.union([v.literal("production"), v.literal("development"), v.literal("staging")]),
  DATABASE_URL: v.pipe(v.string(), v.url()),
  GOOGLE_CLIENT_ID: v.string(),
  GOOGLE_CLIENT_SECRET: v.string(),
  SITE_URL: v.pipe(v.string(), v.url()),
  SESSION_SECRET: v.string(),
  CRYPTO_SECRET: v.string(),
  CLOUDFLARE_R2_BUCKET_NAME: v.string(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: v.string(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: v.string(),
  CLOUDFLARE_R2_CUSTOM_DOMAIN: v.string(),
  CLOUDFLARE_ACCOUNT_ID: v.string(),
  MAIL_GMAIL_ADDRESS: v.pipe(v.string(), v.email()),
  MAIL_NOTIFY_ADDRESS: v.pipe(v.string(), v.email()),
  MAIL_SUPPORT_ADDRESS: v.pipe(v.string(), v.email()),
  MAIL_SYSTEM_ADDRESS: v.pipe(v.string(), v.email()),
  MAIL_PASSWORD: v.string(),
  MAIL_HOST: v.string(),
  STRIPE_SECRET_KEY: v.string(),
  STRIPE_PLATFORM_ACCOUNT_ID: v.string(),
  UPSTASH_REDIS_REST_URL: v.pipe(v.string(), v.url()),
  UPSTASH_REDIS_REST_TOKEN: v.string(),
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
