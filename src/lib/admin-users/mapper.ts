import type { AdminUser, AppRole } from "./types";

const APP_ROLES = ["admin", "staff", "user"] as const satisfies readonly AppRole[];
const STATUSES = ["active", "inactive", "pending"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid profile: ${key} must be a non-empty string`);
  }
  return value;
}

function nullableString(row: Record<string, unknown>, key: string): string | null {
  const value = row[key];
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") {
    throw new Error(`Invalid profile: ${key} must be a string or null`);
  }
  return value;
}

export function mapProfileToAdminUser(value: unknown): AdminUser {
  if (!isRecord(value)) throw new Error("Invalid profile: expected an object");

  const role = requiredString(value, "role");
  if (!(APP_ROLES as readonly string[]).includes(role)) {
    throw new Error(`Invalid profile: unknown role "${role}"`);
  }

  const status = requiredString(value, "status");
  if (!(STATUSES as readonly string[]).includes(status)) {
    throw new Error(`Invalid profile: unknown status "${status}"`);
  }

  const createdAt = requiredString(value, "created_at");
  if (Number.isNaN(Date.parse(createdAt))) {
    throw new Error("Invalid profile: created_at must be an ISO date");
  }

  return {
    id: requiredString(value, "id"),
    name: nullableString(value, "name"),
    email: requiredString(value, "email"),
    role: role as AppRole,
    image: nullableString(value, "image"),
    status: status as AdminUser["status"],
    createdAt,
  };
}
