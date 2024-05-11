import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { bugRoutes } from "./api/bugs/bug.routes.js";
import { userRoutes } from "./api/users/user.routes.js";
import { authRoutes } from "./api/auth/auth.routes.js";

const app = express();

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:10000",
    "http://localhost:4001",
    "http://localhost:3000",
    "http://localhost:10000",
  ],
  credentials: true,
};

// Express Config:
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/bug", bugRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(3030, () => console.log("Server ready at port 3030"));
