import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: "environment.env", silent: true });
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace(/Bearer\s?/, "");
    const compare = await compareToken(token, accessTokenSecret);
    if (!compare) return res.status(401).json("Вы не авторизованы!");
    req.userID = compare.id;
    req.role = compare.role;
    next();
  } catch (e) {
    req.err = e;
    console.log(e);
    return res.status(401).json("Вы не авторизованы!");
  }
};

async function compareToken(token, secret) {
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) resolve(false);
      resolve(decoded);
    });
  });
}
