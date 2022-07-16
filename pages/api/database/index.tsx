// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { check } from "express-validator";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessTokenSSR } from "@Auth/cookie";
import { verifyToken } from "@Auth/jwt";
import { ResponseInterface } from "@Constants/Types";
import mongo from "@Database/mongo";
import ValidateData from "@Server/ExpressValidate";
import PostRequest, { handleErrorCode } from "@Server/PostRequest";

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
    const findItem = await db
      ?.collection(tableName)
      .findOne({ _id: new ObjectId(id) });
    if (!findItem?._createdOn) {
      changes["$set"] = { ...changes["$set"], _createdOn: new Date() };
    }
    changes["$set"] = { ...changes["$set"], _updatedOn: new Date() };

    await db
      ?.collection(tableName)
      .findOneAndUpdate({ _id: new ObjectId(id) }, changes, {
        upsert: true,
      });

    res.status(200).json({ success: true });
  } catch (err: any) {
    handleErrorCode(err, res);
  }
}
