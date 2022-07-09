import { NextApiRequest, NextApiResponse } from "next";

function PostRequest(req: NextApiRequest, res?: NextApiResponse) {
  return new Promise((resolve, reject) => {
    const requestMethod = req.method;
    if (requestMethod === "POST") {
      return resolve("");
    }
    const error = new Error(`[${requestMethod}] method not supported`);
    // @ts-ignore
    error.code = 404;
    reject(error);
  });
}
export default PostRequest;

export const handleErrorCode = (error: any, res?: NextApiResponse) => {
  let errorCode = null;
  let errorMessage =
    error?.message || "Server encountered an error. Please try again.";

  if (error?.code) {
    errorCode = error?.code;
    if (errorCode !== 404 && errorCode !== 401) {
      errorCode = 518;
    }
  }

  errorCode = errorCode || 518;
  if (res) {
    return res.status(errorCode).json({ success: false, error: errorMessage });
  }
  return {
    code: errorCode,
    message: errorMessage,
  };
};
