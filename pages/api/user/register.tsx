// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "@server/ExpressValidate";
import mongo from "@database/mongo";
import bcrypt from "bcryptjs";
import { ResponseInterface, UserInterface } from "@constants/Types";

const validate = ValidateData([
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Please enter password with min 6 characters").isLength({
    min: 6,
  }),
]);

const PASSWORD_HASH = "my-pass-word";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) {
  try {
    await validate(req, res);
    const { name, email, password } = req.body;

    const userDB = await mongo().getUserDB();
    const isExists = await userDB?.count({ email });
    if (isExists != 0) {
      throw new Error("[Register] User Already Registered");
    }

    const password_hash = await bcrypt.hash(password, PASSWORD_HASH);

    const UserInfo = {
      isAdmin: false,
      name,
      email,
      password: password_hash,
      _createdOn: new Date(),
      _updatedOn: new Date(),
    };

    await userDB?.insertOne(UserInfo);
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(501).json({ success: false, error: err?.message });
  }
}
