// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { check } from "express-validator";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessTokenSSR } from "../../../Auth/cookie";
import { verifyToken } from "../../../Auth/jwt";
import mongo from "../../../Database/mongo";
import ValidateData from "../../../Server/ExpressValidate";
import PostRequest from "../..//../Server/PostRequest";

type Data = {
  success: boolean;
  error?: string;
};
const validate = ValidateData([
  check("id", "Id not present").exists(),
  check("changes", "Id not present").exists(),
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await PostRequest(req, res);
    await validate(req, res);
    const tableName = req.headers?.["x-custom-table"] as string;
    if (!tableName || !["items"].includes(tableName)) {
      throw new Error("Invalid Params");
    }

    const token = getAccessTokenSSR(req);
    const { error } = verifyToken(token) as any;
    if (error) {
      const err = new Error() as any;
      err.code = 401;
      err.message = error.message;
      throw err;
    }

    const db = await mongo().getDatabase();

    const { id, changes } = req.body;
    await db
      ?.collection(tableName)
      .findOneAndUpdate({ _id: ObjectId(id) }, changes);

    res.status(200).json({ success: true });
  } catch (err: any) {
    const statusCode = err?.code === 401 ? 401 : 501;
    res.status(statusCode).json({ success: false, error: err?.message });
  }
}
