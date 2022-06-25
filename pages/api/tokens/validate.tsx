// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PostRequest from "../../../Server/PostRequest";
import { generateToken, verifyToken } from "../../../Auth/jwt";
import { getAccessTokenSSR } from "../../../Auth/cookie";

type Data = {
  name?: string;
  status?: string;
  error?: string;
  success?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await PostRequest(req, res);
  const token = getAccessTokenSSR(req);
  console.log("🚀 ~ file: validate.tsx ~ line 27 ~ token", token);
  /* Send succes with token */
  res.status(200).json({ success: true });
}
