import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      require: true,
    },
    coverImage: {
      type: String,
      require: true,
    },
    file: {
      type: String,
      require: true,
    },
    genre: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Book>("Books", bookSchema);
