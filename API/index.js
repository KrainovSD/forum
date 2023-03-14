import express from "express";
const app = express();
app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));

import cookieParser from "cookie-parser";
app.use(cookieParser());

import untils from "./untils/index.js";
app.use(untils.logger);

import * as dotenv from "dotenv";
dotenv.config({ path: "environment.env", silent: true });

const PORT = process.env.PORT || 3000;
const PRODUCTION = process.env.PRODUCTION || false;

if (!PRODUCTION) {
  app.use((req, res, next) => {
    res.header({
      "Access-Control-Allow-Origin": `http://${process.env.HOST}`,
      "Access-Control-Allow-Methods": "DELETE,GET,POST,PUT",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Content-Security-Policy":
        "default-src 'self' https://krainovdictionary.ru; style-src 'self'; script-src 'self'",
      "X-Content-Security-Policy":
        "default-src 'self'; style-src 'self'; script-src 'self'",
      "X-WebKit-CSP": "default-src 'self'; style-src 'self'; script-src 'self'",
    });
    next();
  });
} else {
  app.use((req, res, next) => {
    res.set({
      "Content-Security-Policy":
        "default-src https://krainovdictionary.ru; style-src https://krainovdictionary.ru; script-src https://krainovdictionary.ru *.google-analytics.com https://www.googletagmanager.com; report-uri: https://krainovdictionary.ru/csp/report;",
      "X-Content-Security-Policy":
        "default-src https://krainovdictionary.ru; style-src https://krainovdictionary.ru; script-src https://krainovdictionary.ru *.google-analytics.com https://www.googletagmanager.com; report-uri: https://krainovdictionary.ru/csp/report;",
      "X-WebKit-CSP":
        "default-src https://krainovdictionary.ru; style-src https://krainovdictionary.ru; script-src https://krainovdictionary.ru *.google-analytics.com https://www.googletagmanager.com; report-uri: https://krainovdictionary.ru/csp/report;",
    });
    next();
  });
}
if (PRODUCTION) console.log(process.env);

app.listen(PORT, () => {
  console.log(`server has been started at port ${PORT}`);
});

import authRoutes from "./models/authModels/AuthRoutes.js";
app.use("/api/auth", authRoutes);
import userRoutes from "./models/userModels/UserRoutes.js";
app.use("/api/user", userRoutes);
import messageRoutes from "./models/messageModels/MessageRoutes.js";
app.use("/api/message", messageRoutes);
import topicRoutes from "./models/topicModels/TopicRoutes.js";
app.use("/api/topic", topicRoutes);
import postRoutes from "./models/postModels/PostRoutes.js";
app.use("/api/post", postRoutes);
import commentRoutes from "./models/commentModels/CommentRoutes.js";
app.use("/api/comment", commentRoutes);
import likeRoutes from "./models/likeModels/LikeRoutes.js";
app.use("/api/like", likeRoutes);

app.get("*", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "dist", "app", "index.html"));
  } catch (e) {
    req.err = e;
    res.status(500).json();
  }
});

import db from "./db.js";
app.post("/test", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await db.query(`SELECT * FROM person WHERE id = ANY($1)`, [
      id,
    ]);
    console.log(result.rows);
    res.status(200).json();
  } catch (e) {
    console.log(e);
  }
});
