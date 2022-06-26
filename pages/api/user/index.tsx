// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PostRequest from "../../../Server/PostRequest";
import { verifyToken } from "../../../Auth/jwt";
import { getAccessTokenSSR } from "../../../Auth/cookie";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await PostRequest(req, res);
  const token = getAccessTokenSSR(req);
  const { error } = verifyToken(token);
  if (error) {
    res.status(401).json({ success: false });
    return;
  }
  res.status(200).json({ success: true });
}
