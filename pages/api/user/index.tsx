// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import PostRequest, { handleErrorCode } from "@Server/PostRequest";
import { verifyToken } from "@Auth/jwt";
import { getAccessTokenSSR } from "@Auth/cookie";
import mongo from "@Database/mongo";
import {
  CartInterface,
  ResponseInterface,
  UserInterface,
} from "@Constants/Types";

interface ResultInterface extends ResponseInterface {
  result?: {
    user: UserInterface;
    cart: CartInterface;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResultInterface>
) {
  try {
    await PostRequest(req, res);
    const token = getAccessTokenSSR(req);
    const { result, error } = verifyToken(token);
    if (!result || error) {
      const err = new Error() as any;
      err.code = 401;
      err.message = "[Validate] Invalid Token Present";
      throw err;
    }

    const userDB = await mongo().getUserDB();
    const user = (await userDB?.findOne({
      _id: new ObjectId(result._id),
    })) as unknown as UserInterface;

    /* Check if exists */
    if (!user) {
      throw new Error("[Validate] Invalid User");
    }

    const cartDB = await mongo().getCartDB();
    const cart = (await cartDB?.findOne({
      _id: user._id,
    })) as unknown as CartInterface;

    try {
      const lastUpdatedOn = new Date(result._updatedOn).getTime();
      const updatedOn = user._updatedOn.getTime();
      if (updatedOn > lastUpdatedOn) {
        const err = new Error() as any;
        err.code = 401;
        err.message = "[Validate] Invalid Token Present";
        throw err;
      }
    } catch (err) {}

    res.status(200).json({ success: true, result: { user, cart } });
  } catch (err: any) {
    handleErrorCode(err, res);
  }
}
