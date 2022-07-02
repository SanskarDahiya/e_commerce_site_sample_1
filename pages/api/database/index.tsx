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

    const token = getAccessTokenSSR(req);
    const { result, error } = verifyToken(token) as any;
    if (error) {
      const err = new Error() as any;
      err.code = 401;
      err.message = error.message;
      throw err;
    }

    const db = await mongo().getDatabase();
    // const user = await db
    //   ?.collection("users")
    //   .findOne({ _id: ObjectId(result?.id) });

    // /* Check if exists */
    // if (!user) {
    //   throw new Error("No User Found");
    // }

    const { id, changes } = req.body;
    await db
      ?.collection("items")
      .findOneAndUpdate({ _id: ObjectId(id) }, changes);

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(501).json({ success: false, error: err?.message });
  }
}
