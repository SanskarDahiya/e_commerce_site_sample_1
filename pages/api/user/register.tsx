// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "../../../Server/ExpressValidate";

type Data = {
  name: string;
};

const validate = ValidateData([
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Please enter password with min 6 characters").isLength({
    min: 6,
  }),
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("🚀 ~ file: login.tsx ~ line 20 ~ req", req.query, req.body);
  await validate(req, res);
  res.status(200).json({ name: "John Doe" });
}
