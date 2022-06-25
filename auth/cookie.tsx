import Cookies from "js-cookie";
import { NextApiRequest } from "next";
import { verifyToken } from "./jwt";

interface ObjectInterface<T> {
  [key: string]: T;
}

export function getAccessTokenSSR(req: NextApiRequest): string {
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

export const getUserFromCookie = () => {
  let token = Cookies.get("token");
  token = (token || "").split(" ").pop();
  if (token) {
    const profileData = verifyToken(token);
    return profileData;
  }
};
