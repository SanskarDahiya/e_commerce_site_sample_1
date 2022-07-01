// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "../../../Server/ExpressValidate";
import bcrypt from "bcryptjs";
import PostRequest from "../../../Server/PostRequest";
import { generateToken } from "../../../Auth/jwt";
import mongo from "../../../Database/mongo";

type Data = {
  name?: string;
  status?: string;
  error?: string;
  success?: boolean;
};

const validate = ValidateData([
  check("email", "please include a valid email").isEmail(),
  check("password", "password is required").exists(),
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await PostRequest(req, res);
    await validate(req, res);
    const { email, password } = req.body;
    /* Check user email in database */
    const db = await mongo().getDatabase();
    const user = await db?.collection("user").findOne({ email });

    /* Check if exists */
    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    /* Check and compare password */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Password");
    }

    const payload = {
      id: user._id,
      isAdmin: user.isAdmin,
      email: user.email,
      createdAt: new Date(),
    };

    /* Sign token */
    const Rtoken = generateToken(
      { ...payload, isRefreshToken: true },
      {
        expiresIn: "1h",
      }
    );

    res.setHeader("x-refresh-token", "Bearer " + Rtoken);
    /* Sign token */
    const token = generateToken(payload, {
      expiresIn: "5m",
    });
    res.setHeader("x-access-token", "Bearer " + token);
    /* Send succes with token */
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(501).json({ success: false, error: err?.message });
  }
}
