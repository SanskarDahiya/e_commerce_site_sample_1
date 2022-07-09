// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateAccessToken, verifyToken } from "@Auth/jwt";
import { ResponseInterface, UserInterface } from "@Constants/Types";
import mongo from "@Database/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) {
  try {
    let token = req.headers["x-refresh-token"] as string;
    const { result, error } = verifyToken(token);
    if (error || !result?.isRefreshToken) {
      const err = new Error() as any;
      err.message = "[Refresh] Invalid Token";
      throw err;
    }
    const userDB = await mongo().getUserDB();
    const user = (await userDB?.findOne({
      _id: new ObjectId(result._id),
    })) as unknown as UserInterface;

    /* Check if exists */
    if (!user) {
      throw new Error("No User Found");
    }

    const accessToken = generateAccessToken(user);

    res.setHeader("x-access-token", `Bearer ${accessToken}`);
    res.status(200).json({ success: true });
  } catch (err: any) {
    const statusCode = err?.code === 401 ? 401 : 501;
    res.status(statusCode).json({ success: false, error: err?.message });
  }
}
