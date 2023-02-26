import express from "express";
const app = express();
app.use(express.json());
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
      "Access-Control-Allow-Origin": "http://192.168.0.102:8080",
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

/*import bcrypt from "bcrypt";
const saltRounds = 12;
import db from "./db.js";

import jwt from "jsonwebtoken";
const secretToken = "dsadasdas3232";

console.log("start");
async function getHash(password) {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(hash);
  console.log(hash.length);
  const createHash = await db.query("INSERT INTO password (hash) VALUES ($1)", [
    hash,
  ]);

  /*const pass = await db.query("SELECT * FROM password WHERE id=$1", [2]);
  const oldHash = pass.rows[0].hash;
  console.log(oldHash);
  const compare = await bcrypt.compare(password, oldHash);
  console.log(compare);
}

async function getToken() {
  let token = await getAccessToken();
  console.log(token);
  const oldToken = token;
  token = token.split(".");
  token = token[2];
  console.log(token.length);
  const saveToken = await db.query("UPDATE password set token=$1 WHERE id=$2", [
    token,
    2,
  ]);

  let fetchToken = await db.query("SELECT token FROM password WHERE id=$1", [
    2,
  ]);
  fetchToken = fetchToken.rows[0].token;
  console.log(fetchToken == token);
  let checkToken = await compareToken(oldToken);
  console.log(checkToken);
}

async function getSalt() {
  const salt = await bcrypt.genSalt(saltRounds);
  console.log(salt);
  console.log(salt.length);
}

async function setDate() {
  let date = new Date();
  const setData = await db.query(
    "INSERT INTO date (date) VALUES ($1) RETURNING *",
    [date]
  );
  //const setData = await db.query("SELECT * FROM date WHERE id=$1", [12]);
  const dateInDB = setData.rows[0].date;
  console.log(dateInDB);
  const newDate = new Date(dateInDB);
  console.log(newDate.getDate());
}
const date = new Date();
console.log(date);
date.setHours(date.getHours() + 1);
console.log(date);
console.log(date.getHours(), date.getUTCHours());
console.log("end");

*/
