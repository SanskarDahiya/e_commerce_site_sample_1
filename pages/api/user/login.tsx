// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "../../../Server/ExpressValidate";

type Data = {
  name: string;
};

const validate = ValidateData([
  check("email", "please include a valid email").isEmail(),
  check("password", "password is required").exists(),
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("🚀 ~ file: login.tsx ~ line 20 ~ req", req.query, req.body);
  await validate(req, res);
  res.status(200).json({ name: "John Doe" });
}
