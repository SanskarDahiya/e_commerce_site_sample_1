// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import simpleGit from "simple-git";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = {} as any;
  try {
    const git = simpleGit();
    await git.init();
    result.init = true;
    try {
      await git.checkoutBranch("public-images", "main");
    } catch (err: any) {
      const message = err.message as string;
      if (message.includes("public-images") && message.includes("exists")) {
        await git.checkout("public-images");
      } else {
        throw err;
      }
    }
    result.checkout = true;

    result.pull_summary = await git.pull("origin", "public-images");

    await git.add("./public/images/*");
    result.add = true;

    result.commit_summary = await git.commit("Auto File Upload -");
    result.push_summary = await git.push("origin", "public-images");

    res.status(200).send(JSON.stringify({ success: true, result }, null, 4));
  } catch (err: any) {
    res
      .status(518)
      .send(
        JSON.stringify({ success: false, error: err.message, result }, null, 4)
      );
  }
}
