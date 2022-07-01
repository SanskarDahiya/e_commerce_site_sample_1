import Cookies from "js-cookie";
import jwt, { SignOptions } from "jsonwebtoken";

const SECRET_KEY = "MY CUSTOM KEY PASS PAIR";

export function generateToken(
  payload: string | Buffer | object,
  options?: SignOptions
): string {
  return jwt.sign(payload, SECRET_KEY, options);
}

export function verifyToken(jwtToken: string, isLogError?: boolean) {
  try {
    if (jwtToken && jwtToken.startsWith("Bearer")) {
      jwtToken = jwtToken.split(" ").pop() || "";
    }
    const result = jwt.verify(jwtToken, SECRET_KEY);
    return { result };
  } catch (e: any) {
    isLogError && console.log("e:", e.message);
    return { error: e };
  }
}
