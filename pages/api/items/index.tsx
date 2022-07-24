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
    let { limit = 10, offset = 0, filter, sort } = req.body;
    const itemDB = await mongo().getItemsDB();
    if (!itemDB) {
      throw new Error();
    }
    try {
      filter = JSON.parse(JSON.stringify(filter));
    } catch (err) {
      filter = null;
    }
    if (filter?._id && typeof filter._id === "string") {
      filter._id = new ObjectId(filter._id);
    }

    try {
      sort = JSON.parse(JSON.stringify(sort));
    } catch (err) {
      sort = null;
    }

    if (!sort || typeof sort !== "object" || !Object.keys(sort).length) {
      sort = null;
    }
    filter = filter || {};
    sort = sort || { _id: 1 };
    const itemsResult = await itemDB
      .find(filter)
      .sort(sort)
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
    console.log("🚀 ~ file: index.tsx ~ line 55 ~ err", err);
    handleErrorCode(err, res);
  }
}
