import { randomInt } from "crypto";

// Crockford's base32 alphabet: digits + uppercase letters minus I, L, O, U,
// which are easy to misread or mistype when a guest copies a code by hand.
const TOKEN_CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const TOKEN_LENGTH = 5;

export function generateGuestToken() {
  let token = "";
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += TOKEN_CHARS[randomInt(TOKEN_CHARS.length)];
  }
  return token;
}
