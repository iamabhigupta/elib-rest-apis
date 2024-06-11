import app from "./src/app";
import { config } from "./src/config/config";
import connectDb from "./src/config/db";

const startServer = async () => {
  // Connect db
  await connectDb();

  const port = config.port || 5000;

  app.listen(port, () => {
    console.log(`Listing on port: ${port}`);
  });
};

startServer();
