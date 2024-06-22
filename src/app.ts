import express from "express";
import createHttpError from "http-errors";
import cors from "cors";

import { globalErrorHandler } from "./middlewares/grlobalErrorHandler";
import userRouter from "./users/userRouter";
import bookRouter from "./books/bookRouter";
import { config } from "./config/config";

const app = express();

app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());

// Routes
app.get("/", (req, res, next) => {
  const err = createHttpError(400, "Something went wrong");
  throw err;
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
