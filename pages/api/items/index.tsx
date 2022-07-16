// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseInterface } from "@Constants/Types";
import mongo from "@Database/mongo";
import PostRequest, { handleErrorCode } from "@Server/PostRequest";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) {
  try {
    await PostRequest(req, res);
    const { limit = 10, offset = 0, filter } = req.body;
    const itemDB = await mongo().getItemsDB();
    if (!itemDB) {
      throw new Error();
    }
    if (filter?._id && typeof filter._id === "string") {
      filter._id = new ObjectId(filter._id);
    }

    const itemsResult = await itemDB
      .find(filter)
      .skip(offset)
      .limit(limit)
      .toArray();
    const items = itemsResult.map((data) => {
      // @ts-ignore
      data._id = data._id.toString();
      if (!data.image && typeof data.imageUrl === "string") {
        data.image = { url: data.imageUrl };
      }
      return data;
    });

    res.status(200).json({ success: true, result: items });
  } catch (err: any) {
    handleErrorCode(err, res);
  }
}
