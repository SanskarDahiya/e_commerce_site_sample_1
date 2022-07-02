// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PostRequest from "../../../Server/PostRequest";
import { verifyToken } from "../../../Auth/jwt";
import { getAccessTokenSSR } from "../../../Auth/cookie";
import mongo from "../../../Database/mongo";
import { ObjectId } from "mongodb";

type Data = {
  success: boolean;
  result?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await PostRequest(req, res);
    const token = getAccessTokenSSR(req);
    const { result, error } = verifyToken(token) as any;
    if (error) {
      const err = new Error() as any;
      err.code = 401;
      err.message = error.message;
      throw err;
    }

    const db = await mongo().getDatabase();
    const user = await db
      ?.collection("users")
      .findOne({ _id: ObjectId(result?.id) });

    /* Check if exists */
    if (!user) {
      throw new Error("No User Found");
    }

    try {
      const lastUpdatedOn = new Date(result?.updatedOn)?.getTime();
      const updatedOn = user?._updatedOn?.getTime();
      if (updatedOn > lastUpdatedOn) {
        res.status(401).json({ success: false });
        return;
      }
    } catch (err) {
      console.log("🚀 ~ file: index.tsx ~ line 46 ~ err", err);
    }
    res.status(200).json({ success: true, result: user });
  } catch (err: any) {
    const statusCode = err?.code === 401 ? 401 : 501;
    res.status(statusCode).json({ success: false, error: err?.message });
  }
}
