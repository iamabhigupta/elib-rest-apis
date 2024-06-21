import { User } from "../users/userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverlmage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
