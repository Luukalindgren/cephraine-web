import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.get("/", (req, res) => {
  res.send("Cephraine Backend is running");
});

app.get('/api/logs', async (req, res) => {
  const logs = await prisma.log.findMany();
  res.json(logs);
})

export default app;
