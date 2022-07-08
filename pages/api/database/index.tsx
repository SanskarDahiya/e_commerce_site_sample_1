// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { check } from "express-validator";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessTokenSSR } from "@auth/cookie";
import { verifyToken } from "@auth/jwt";
import { ResponseInterface } from "@constants/Types";
import mongo from "@database/mongo";
import ValidateData from "@server/ExpressValidate";
import PostRequest from "@server/PostRequest";

const validate = ValidateData([
  check("id", "Id not present").exists(),
  check("changes", "Id not present").exists(),
]);

const FRONTEND_DATABASE_ACCESS = ["items", "user_carts"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) {
  try {
    await PostRequest(req, res);
    await validate(req, res);
    const { id, changes } = req.body;
    const tableName = req.headers["x-custom-table"] as string;

    if (
      !tableName ||
      !FRONTEND_DATABASE_ACCESS.includes(tableName) ||
      !id ||
      !changes
    ) {
      throw new Error("[Database] Invalid Parameters");
    }

    const token = getAccessTokenSSR(req);
    const { error, result } = verifyToken(token);
    if (!result || error) {
      const err = new Error() as any;
      err.code = 401;
      err.message = "[Database] Invalid Token";
      throw err;
    }

    const db = await mongo().getDatabase();
    await db
      ?.collection(tableName)
      .findOneAndUpdate({ _id: new ObjectId(id) }, changes, {
        upsert: true,
      });

    res.status(200).json({ success: true });
  } catch (err: any) {
    const statusCode = err?.code === 401 ? 401 : 501;
    res.status(statusCode).json({ success: false, error: err?.message });
  }
}
