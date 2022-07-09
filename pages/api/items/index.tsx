// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseInterface } from "@Constants/Types";
import mongo from "@Database/mongo";
import PostRequest, { handleErrorCode } from "@Server/PostRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) {
  try {
    await PostRequest(req, res);
    const { limit = 10, offset = 0 } = req.body;
    const itemDB = await mongo().getItemsDB();
    if (!itemDB) {
      throw new Error();
    }
    const itemsResult = await itemDB.find().skip(offset).limit(limit).toArray();
    const items = itemsResult.map((data) => {
      // @ts-ignore
      data._id = data._id.toString();
      return data;
    });

    res.status(200).json({ success: true, result: items });
  } catch (err: any) {
    handleErrorCode(err, res);
  }
}
