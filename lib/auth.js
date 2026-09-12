import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAdminPasswordHash, setAdminPasswordHash } from "./db.js";

export const SESSION_COOKIE = "ph_admin_session";
const DEFAULT_PASSWORD = "padelhub2026";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "padel-hub-dev-secret-change-me";
}

export function ensureAdminPassword() {
  const existing = getAdminPasswordHash();
  if (!existing) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD, 10);
    setAdminPasswordHash(hash);
    return hash;
  }
  return existing;
}

export function verifyPassword(password) {
  const hash = ensureAdminPassword();
  return bcrypt.compareSync(String(password || ""), hash);
}

export function changePassword(newPassword) {
  const hash = bcrypt.hashSync(String(newPassword), 10);
  setAdminPasswordHash(hash);
}

export function createSessionToken() {
  return jwt.sign({ role: "admin" }, getSecret(), { expiresIn: "30d" });
}

export function verifySessionToken(token) {
  try {
    const payload = jwt.verify(token, getSecret());
    return payload && payload.role === "admin";
  } catch {
    return false;
  }
}

/** For use in Server Components / Route Handlers (reads the cookie jar). */
export function isAdminAuthed() {
  const store = cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
