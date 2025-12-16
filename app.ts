import express from "express";
import bodyParser from "body-parser";
import errorMiddleware from "./middleware/error-handler.middleware.ts";
// import connectToDatabase from "./database/ps.ts";
import router from "./routes/index.routes.ts";
import createRateLimiter from "./middleware/rate-limiter.middleware.ts";
import { PORT } from "./config/env.ts";

const app = express();
app.use(bodyParser.json());
app.use(createRateLimiter({}));

app.get("/", (req, res) => {
  res.status(200).json({ c: 200, m: "Welcome to the API" });
});

app.use(router);
app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT as any, "0.0.0.0", async () => {
    // await connectToDatabase();
    console.log(`Server running at http://localhost:${PORT}`);
  });
}