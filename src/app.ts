import express from "express";
import createHttpError from "http-errors";

import { globalErrorHandler } from "./middlewares/grlobalErrorHandler";
import userRouter from "./users/userRouter";
import bookRouter from "./books/bookRouter";

const app = express();
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
