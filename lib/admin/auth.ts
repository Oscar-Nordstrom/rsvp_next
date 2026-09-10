import "server-only";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD environment variable");
  }
  return password;
}

// The cookie stores a hash of the password rather than the password itself,
// so it never round-trips the real secret to the browser.
function sessionToken() {
  return createHash("sha256").update(getAdminPassword()).digest("hex");
}

export function verifyAdminPassword(password: string) {
  const expected = Buffer.from(getAdminPassword());
  const actual = Buffer.from(password);
  return (
    expected.length === actual.length && timingSafeEqual(expected, actual)
  );
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === sessionToken();
}
