import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

/* JWT secret key */
const KEY = "THIS IS CUSTOM KEY";
export default async function refreshToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cookies } = req;
  try {
    let Rtoken = cookies["r-token"];
    Rtoken = Rtoken.split(" ")[1];
    const payload = jwt.verify(Rtoken, KEY);
    const {
      id: userId,
      email: userEmail,
      createdAt: userCreated,
    } = payload as any;

    const newPayload = {
      id: userId,
      email: userEmail,
      createdAt: userCreated,
    };
    /* Sign token */
    const token = jwt.sign(newPayload, KEY, {
      expiresIn: 60, // in seconds
    });

    res.setHeader("x-access-token", "Bearer " + token);

    /* Send succes with token */
    res.status(200).json({ success: true });
  } catch (error) {
    // we don't want to send status 401 here.
    res.send({ error: error.message });
  }
}
