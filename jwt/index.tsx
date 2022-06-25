import jwt, { SignOptions } from "jsonwebtoken";
import { NextApiRequest } from "next";

interface ObjectInterface<T> {
  [key: string]: T;
}

const SECRET_KEY = "MY CUSTOM KEY PASS PAIR";

export function generateToken(
  payload: string | Buffer | object,
  options?: SignOptions
): string {
  return jwt.sign(payload, SECRET_KEY, options);
}

export function verifyToken(jwtToken: string, isLogError?: boolean) {
  try {
    const result = jwt.verify(jwtToken, SECRET_KEY);
    return { result };
  } catch (e) {
    isLogError && console.log("e:", e.message);
    return { error: e };
  }
}

export function getAccessToken(req: NextApiRequest): string {
  let token;
  if (req?.cookies) {
    token = req.cookies.token;
  } else if (req?.headers?.cookie) {
    const parsedItems = {} as ObjectInterface<string>;
    const cookiesItems = req.headers.cookie.split("; ");
    cookiesItems.forEach((cookies: string) => {
      const parsedItem = cookies.split("=");
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
    token = parsedItems.token;
  }
  token = (token || "").split(" ").pop();
  return token || "";
}
