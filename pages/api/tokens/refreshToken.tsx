// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessTokenSSR } from "../../../Auth/cookie";
import { generateToken, verifyToken } from "../../../Auth/jwt";
import { getUserDataById } from "../../../Constants/user";

type Data = {
  success?: Boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let token = req.headers["x-refresh-token"];
  token = (token + "").split(" ").pop() || "";
  const { result, error } = verifyToken(token) as any;
  if (error || !result?.isRefreshToken) {
    res.status(518).json({ success: false, error: "Invalid Token" });
    return;
  }
  const user = getUserDataById(result.id) as any;
  const userId = user.id,
    userEmail = user.email,
    userCreated = user.createdAt;

  const payload = {
    id: userId,
    email: userEmail,
    isAdmin: user?.isAdmin,
    createdAt: userCreated,
  };

  /* Sign token */
  const accessToken = generateToken(payload, {
    expiresIn: "1m",
  });
  res.setHeader("x-access-token", "Bearer " + accessToken);
  res.status(200).json({ success: true });
}
