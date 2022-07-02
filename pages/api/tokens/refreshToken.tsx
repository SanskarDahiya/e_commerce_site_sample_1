// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessTokenSSR } from "../../../Auth/cookie";
import { generateToken, verifyToken } from "../../../Auth/jwt";
import { getUserDataById } from "../../../Constants/user";
import mongo from "../../../Database/mongo";

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
  const db = await mongo().getDatabase();
  const user = await db
    ?.collection("users")
    .findOne({ _id: new ObjectId(result?.id) });

  /* Check if exists */
  if (!user) {
    throw new Error("No User Found");
  }

  const payload = {
    id: user._id.toString(),
    isAdmin: user.isAdmin,
    email: user.email,
    createdAt: new Date(),
    updatedOn: user._updatedOn,
  };

  /* Sign token */
  const accessToken = generateToken(payload, {
    expiresIn: "1m",
  });

  res.setHeader("x-access-token", "Bearer " + accessToken);
  res.status(200).json({ success: true });
}
