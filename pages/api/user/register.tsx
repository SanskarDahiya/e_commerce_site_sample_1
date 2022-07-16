// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { check } from "express-validator";
import ValidateData from "@Server/ExpressValidate";
import mongo from "@Database/mongo";
import bcrypt from "bcryptjs";
import { ResponseInterface } from "@Constants/Types";

const validate = ValidateData([
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Please enter password with min 6 characters").isLength({
    min: 6,
  }),
]);

const PASSWORD_HASH = +(process.env.BCRYPT_SECRET_KEY as string) || 2;
if (!PASSWORD_HASH || PASSWORD_HASH == NaN) {
  console.error(`BCRYPT_SECRET_KEY not found`);
  process.exit(0);
}

const get_otp = () => {
  return "010203";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) {
  try {
    await validate(req, res);
    const { name, email, password, otp } = req.body;

    const userDB = await mongo().getUserDB();
    if (!userDB) {
      throw new Error("Server Encounter Some Error");
    }
    const user = await userDB.findOne({ email });
    if (user) {
      const { _id: userId, verification_pending } = user;

      if (otp && verification_pending) {
        const isMatch = await bcrypt.compare(otp, user.otpHash);
        if (!isMatch) {
          throw new Error("[Login] Invalid OTP");
        }
        await userDB.findOneAndUpdate(
          { _id: userId },
          {
            $set: { _updatedOn: new Date() },
            $unset: {
              otpHash: 1,
              verification_pending: 1,
            },
          }
        );

        res.status(200).json({ success: true });
        return;
      } else if (verification_pending) {
        const password_hash = await bcrypt.hash(password, PASSWORD_HASH);
        const otp_hash = await bcrypt.hash(get_otp(), PASSWORD_HASH);
        await userDB.findOneAndUpdate(
          { _id: userId },
          {
            $set: {
              password: password_hash,
              otpHash: otp_hash,
              verification_pending: true,
              _updatedOn: new Date(),
            },
          }
        );
        res.status(200).json({ success: true, result: { resendOtp: true } });
        return;
      }
      throw new Error("[Register] User Already Registered");
    } else if (otp) {
      throw new Error("[Register] User Not Found");
    }

    const password_hash = await bcrypt.hash(password, PASSWORD_HASH);
    const otp_hash = await bcrypt.hash(get_otp(), PASSWORD_HASH);

    const UserInfo = {
      isAdmin: false,
      name,
      email,
      password: password_hash,
      otpHash: otp_hash,
      verification_pending: true,
      _createdOn: new Date(),
      _updatedOn: new Date(),
    };

    await userDB.insertOne(UserInfo);
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(501).json({ success: false, error: err?.message });
  }
}
