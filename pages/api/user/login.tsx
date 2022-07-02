// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "../../../Server/ExpressValidate";
import bcrypt from "bcryptjs";
import PostRequest from "../../../Server/PostRequest";
import { generateAccessToken, generateRefreshToken } from "../../../Auth/jwt";
import mongo from "../../../Database/mongo";
import { ResponseInterface, UserInterface } from "../../../Constants/Types";

const validate = ValidateData([
  check("email", "please include a valid email").isEmail(),
  check("password", "password is required").exists(),
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) {
  try {
    await PostRequest(req, res);
    await validate(req, res);
    const { email, password } = req.body;

    /* Check user email in database */
    const UserDB = await mongo().getUserDB();
    const user = (await UserDB?.findOne({ email })) as UserInterface;

    /* Check if exists */
    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    /* Check and compare password */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Password");
    }

    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    res.setHeader("x-access-token", `Bearer ${access_token}`);
    res.setHeader("x-refresh-token", `Bearer ${refresh_token}`);

    /* Send succes with token */
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(501).json({ success: false, error: err?.message });
  }
}
