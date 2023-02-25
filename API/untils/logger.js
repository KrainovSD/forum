import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export default async (req, res, next) => {
  const logJSON = {
    date: formatTimeStamp(new Date()),
    method: req.method,
    path: req.url,
    protocol: req.protocol,
    userAgent: req.get("User-Agent"),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
  };
  res.on("finish", async () => {
    try {
      logJSON.userID = req.userID || "NO AUTH";
      logJSON.status = res.statusCode;
      logJSON.error = req.err ? req.err.stack : "NO ERROR";
      const logString = `${logJSON.date} || ${logJSON.method} || ${logJSON.path} || ${logJSON.protocol} || ${logJSON.ip} || ${logJSON.userID} || ${logJSON.status} \n\n ${logJSON.error} \n\n`;
      console.log("_______");
      console.log(logString);
      await asyncAppendFile(
        path.join(__dirname, "..", "logs", "string.txt"),
        logString
      );
      await asyncAppendFile(
        path.join(__dirname, "..", "logs", "json.txt"),
        `${JSON.stringify(logJSON)} \n\n`
      );
      if (logJSON.status === 500)
        await asyncAppendFile(
          path.join(__dirname, "..", "logs", "errors.txt"),
          `${JSON.stringify(logJSON)} \n\n`
        );
    } catch (e) {
      console.log(e);
    }
  });
  next();
};

function formatTimeStamp(date) {
  let minute = date.getMinutes();
  let hour = date.getHours();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (minute >= 0 && minute < 10) {
    minute = `0${minute}`;
  }
  if (hour >= 0 && hour < 10) {
    hour = `0${hour}`;
  }
  if (month >= 0 && month < 10) {
    month = `0${month}`;
  }
  if (day >= 0 && day < 10) {
    day = `0${day}`;
  }

  return `${hour}:${minute} ${day}-${month}-${year}`;
}

async function asyncAppendFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, "utf8", (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}
