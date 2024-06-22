import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  frontendUrl: process.env.FRONTEND_DOMAIN,
};

export const config = Object.freeze(_config);
