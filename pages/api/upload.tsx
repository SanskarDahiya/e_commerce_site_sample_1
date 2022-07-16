// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ressee {
  files: formidable.Files;
  fields: any;
}
const form_parser = (
  req: NextApiRequest,
  form: IncomingForm
): Promise<ressee> =>
  new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = {} as any;
  try {
    const form = formidable({ multiples: true });
    const ress = await form_parser(req, form);
    const file = Array.isArray(ress.files.file)
      ? ress.files.file[0]
      : ress.files.file;

    const data = fs.readFileSync(file.filepath);
    try {
      fs.readdirSync("./public/images/");
    } catch (err) {
      fs.mkdirSync("./public/images/");
    }
    const newFilePath = `/images/img-${new Date().getTime()}-${
      file.originalFilename
    }`;
    fs.writeFileSync(`./public${newFilePath}`, data);
    result.path = newFilePath;
    res.status(200).send(JSON.stringify({ success: true, result }, null, 4));
  } catch (err: any) {
    res
      .status(518)
      .send(
        JSON.stringify({ success: false, error: err.message, result }, null, 4)
      );
  }
}
