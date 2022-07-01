// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "../../../Server/ExpressValidate";
import mongo from "../../../Database/mongo";
import bcrypt from "bcryptjs";

type Data = {
  success: boolean;
  error?: string;
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
  try {
    await validate(req, res);
    const { name, email, password } = req.body;

    const db = await mongo().getDatabase();
    const isExists = await db?.collection("users").findOne({ email });
    if (isExists) {
      throw new Error("Email Already Exists");
    }

    const password_hash = await bcrypt.hash(password, 1);
    await db?.collection("users").insertOne({
      name,
      email,
      password: password_hash,
      _createdOn: new Date(),
      _updatedOn: new Date(),
      isAdmin: false,
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(501).json({ success: false, error: err?.message });
  }
}
