import fs from "node:fs";
import path from "node:path";

import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import cloudinary from "../config/cloudinary";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  console.log("");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split("/")[-1];
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    console.log({ uploadResult });
    console.log({ bookFileUploadResult });

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete temp files
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading the book files"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const { bookId } = req.params;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  const _req = req as AuthRequest;
  // Check access
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You can not update other's book"));
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let coverImageUrl = "";
  if (files.coverImage) {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/")[-1];
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
    });

    coverImageUrl = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  let bookUrl = "";

  if (files.file) {
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    bookUrl = bookFileUploadResult.secure_url;
    // Delete temp files
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title: title,
      // description: description,
      genre: genre,
      coverImage: coverImageUrl ? coverImageUrl : book.coverImage,
      file: bookUrl ? bookUrl : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();

    if (!books) {
      return next(createHttpError(404, "No books found"));
    }

    res.json(books);
  } catch (error) {
    return next(createHttpError(500, "Error while getting books"));
  }
  res.json({ message: "OK" });
};

const getSingleBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const book = await bookModel.findOne({ _id: id });

    if (!book) {
      return next(createHttpError(404, "No book found"));
    }

    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting book"));
  }
  res.json({ message: "OK" });
};

const deleteSingleBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const book = await bookModel.findOne({ _id: id });

  if (!book) {
    return next(createHttpError(404, "No book found with this id"));
  }

  const _req = req as AuthRequest;
  // Check access
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You can not update other's book"));
  }

  const coverFileSplits = book.coverImage.split("/");
  const coverImagePublicId =
    coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);

  const bookFileSplits = book.file.split("/");
  const bookFilePublicId = bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
  console.log("bookFilePublicId", bookFilePublicId);
  // todo: add try error block
  await cloudinary.uploader.destroy(coverImagePublicId);
  await cloudinary.uploader.destroy(bookFilePublicId, {
    resource_type: "raw",
  });

  await bookModel.deleteOne({ _id: id });

  return res.sendStatus(204);
};

export { createBook, updateBook, listBooks, getSingleBooks, deleteSingleBooks };
