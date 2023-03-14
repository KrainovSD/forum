import { access, constants } from "node:fs/promises";

export const accessPromise = async (dir) =>
  new Promise(async (resolve) => {
    try {
      await access(dir, constants.F_OK);
      resolve(true);
    } catch (e) {
      resolve(false);
    }
  });
