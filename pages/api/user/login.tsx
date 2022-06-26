// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "../../../Server/ExpressValidate";
import bcrypt from "bcryptjs";
import PostRequest from "../../../Server/PostRequest";
import { generateToken } from "../../../Auth/jwt";
import { getUserDataByEmail } from "../../../Constants/user";

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
  await PostRequest(req, res);
  await validate(req, res);
  console.log("After Validate");
  /* Get Post Data */
  const { email, password } = req.body;
  /* Check user email in database */
  const user = getUserDataByEmail(email);

  /* Check if exists */
  if (!user) {
    /* Send error with message */
    res.status(400).json({ status: "error", error: "User Not Found" });
    return;
  }

  const userId = user.id,
    userEmail = user.email,
    userPassword = user.password,
    userCreated = user.createdAt;

  /* Check and compare password */
  const isMatch = await bcrypt.compare(password, userPassword);

  if (!isMatch) {
    /* Send error with message */
    res.status(400).json({ status: "error", error: "Password incorrect" });
    return;
  }

  const payload = {
    id: userId,
    email: userEmail,
    createdAt: userCreated,
  };

  /* Sign token */
  const Rtoken = generateToken(
    { ...payload, isRefreshToken: true },
    {
      expiresIn: "5m",
    }
  );

  res.setHeader("x-refresh-token", "Bearer " + Rtoken);
  /* Sign token */
  const token = generateToken(payload, {
    expiresIn: "1m",
  });
  res.setHeader("x-access-token", "Bearer " + token);
  /* Send succes with token */
  res.status(200).json({ success: true });
}
