import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  // Validation
  // if (!name || !email || !password) {
  //   const error = createHttpError(400, "All fields are required ");
  //   return next(error);
  // }

  // Process
  // Response
  res.json({ message: "User created" });
};

export { createUser };
