import { NextApiRequest, NextApiResponse } from "next";

function PostRequest(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve) => {
    const requestMethod = req.method;
    if (requestMethod === "POST") {
      return resolve("");
    }
    res.status(404).end();
  });
}
export default PostRequest;
