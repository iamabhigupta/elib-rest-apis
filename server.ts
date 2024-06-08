import app from "./src/app";

const startServer = () => {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Listing on port: ${port}`);
  });
};

startServer();
