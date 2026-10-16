// Local development only. Never uses or accepts a hosted service key.
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.admin.local"))
  throw new Error(
    "Local admin credentials already exist in .env.admin.local. No account was changed.",
  );
const status = JSON.parse(
  execFileSync("npx", ["supabase", "status", "-o", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }),
);
if (new URL(status.API_URL).hostname !== "127.0.0.1")
  throw new Error("This script only supports local Supabase.");
const client = createClient(status.API_URL, status.SECRET_KEY, {
  auth: { persistSession: false },
});
const email = "admin@dsrt.test";
const password = randomBytes(24).toString("base64url");
const { data, error } = await client.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (error) throw error;
const { error: roleError } = await client
  .from("admin_users")
  .insert({ user_id: data.user.id });
if (roleError) throw roleError;
writeFileSync(
  ".env.admin.local",
  `# Local development account only. Do not copy to a hosted project.\nADMIN_EMAIL=${email}\nADMIN_PASSWORD=${password}\n`,
  { mode: 0o600 },
);
console.log(
  "Local admin created. Credentials are in the git-ignored .env.admin.local file.",
);
