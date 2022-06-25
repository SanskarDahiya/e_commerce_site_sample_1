// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "../../../Server/ExpressValidate";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* JWT secret key */
const KEY = "THIS IS CUSTOM KEY";
/* Users collection sample */
const USERS = [
  {
    id: 1,
    email: "a@aaa.aaa",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
  {
    id: 2,
    email: "example2@example.com",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
  {
    id: 3,
    email: "example3@example.com",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
  {
    id: 4,
    email: "example4@example.com",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
];

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
  await validate(req, res);
  /* Get Post Data */
  const { email, password } = req.body;
  /* Check user email in database */
  const user = USERS.find((user) => {
    return user.email === email;
  });

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

  /* Create JWT Payload */
  const payload = {
    id: userId,
    email: userEmail,
    createdAt: userCreated,
  };

  /* Sign token */
  const Rtoken = jwt.sign({ ...payload, isRefreshToken: true }, KEY, {
    expiresIn: "5m",
  });

  res.setHeader("x-refresh-token", "Bearer " + Rtoken);
  /* Sign token */
  const token = jwt.sign(payload, KEY, {
    expiresIn: "1m",
  });
  res.setHeader("x-access-token", "Bearer " + token);
  /* Send succes with token */
  res.status(200).json({ success: true });

  // const verify = await jwt.verify(token, KEY);

  // res.status(200).json({ name: "John Doe" });
}
