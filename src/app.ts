import express from "express";
import createHttpError from "http-errors";

import { globalErrorHandler } from "./middlewares/grlobalErrorHandler";

const app = express();

// Routes
app.get("/", (req, res, next) => {
  const err = createHttpError(400, "Something went wrong");
  throw err;
  res.json({ message: "Welcome to elib apis" });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
