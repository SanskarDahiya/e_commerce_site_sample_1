import jwt, { SignOptions } from "jsonwebtoken";
import {
  AccessTokenInterface,
  RefreshTokenInterface,
  UserInterface,
} from "@Constants/Types";

const SECRET_KEY =
  (process.env.JWT_SECRET_KEY as string) || "MY CUSTOM KEY PASS PAIR";

if (!SECRET_KEY) {
  console.error(`JWT_SECRET_KEY not found`);
  process.exit(0);
}

export function generateToken(
  payload: string | Buffer | object,
  options?: SignOptions
): string {
  return jwt.sign(payload, SECRET_KEY, options);
}

export function verifyToken(jwtToken: string, isLogError?: boolean) {
  try {
    if (jwtToken && jwtToken.startsWith("Bearer")) {
      jwtToken = jwtToken.split(" ").pop() || "";
    }
    const result = jwt.verify(jwtToken, SECRET_KEY) as RefreshTokenInterface;
    return { result };
  } catch (e: any) {
    isLogError && console.log("e:", e.message);
    return { error: e };
  }
}

export const generateAccessToken = (user: UserInterface) => {
  const options = { expiresIn: "1d" };
  const accessTokenPayload: AccessTokenInterface = {
    _id: user._id.toString(),
    isAdmin: user.isAdmin,
    email: user.email,
    _createdOn: new Date(),
    _updatedOn: user._updatedOn,
  };
  return generateToken(accessTokenPayload, options);
};

export const generateRefreshToken = (user: UserInterface) => {
  const options = { expiresIn: "5m" };
  const accessTokenPayload: RefreshTokenInterface = {
    _id: user._id.toString(),
    isAdmin: user.isAdmin,
    email: user.email,
    _createdOn: new Date(),
    _updatedOn: user._updatedOn,
    isRefreshToken: true,
  };
  return generateToken(accessTokenPayload, options);
};
