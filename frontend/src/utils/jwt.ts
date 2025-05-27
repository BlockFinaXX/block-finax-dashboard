import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signJwt(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "1d"
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
}
