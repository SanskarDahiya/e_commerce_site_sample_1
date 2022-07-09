import { validationResult } from "express-validator";

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

function validateMiddleware(validations, validationResult) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const errorMessage =
      errors?.errors
        ?.map((value) => {
          const { msg } = value || {};
          return msg || "";
        })
        ?.join("\n") || "Something went wrong";

    next(new Error(errorMessage));
  };
}

const ValidateData = (validations) => {
  const getValidator = validateMiddleware(validations, validationResult);
  return initMiddleware(getValidator);
};
export default ValidateData;
