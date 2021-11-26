import express, { Request, Response } from "express";
import registerRoutes from "./routes/";

const app = express();

app.use(express.json());

registerRoutes(app);

// Catch all 404 Route Not Found
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route Not Found" });
});

export default app;
