import * as crypto from "crypto";
export function generatePassCode(email: string): string {
  // Create a SHA-256 hash
  const hash = crypto.createHash("sha256");
  // Update the hash with the email
  hash.update(email);
  // Get the hashed value as a hexadecimal string
  const hashedEmail = hash.digest("hex");
  // Take the first 6 characters of the hashed email
  const passCode = hashedEmail.substring(0, 6);
  return passCode;
}
