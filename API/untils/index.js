import handleValidatorErrors from "./handleValidatorErrors.js";
import checkAuth from "./checkAuth.js";
import logger from "./logger.js";
import noStrictCheckAuth from "./noStrictCheckAuth.js";
import checkAdmin from "./checkAdmin.js";
import checkModer from "./checkModer.js";

export default {
  checkValidation: handleValidatorErrors,
  checkAuth,
  checkAdmin,
  checkModer,
  logger,
  noStrictCheckAuth,
};
