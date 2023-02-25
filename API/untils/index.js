import handleValidatorErrors from "./handleValidatorErrors.js";
import checkAuth from "./checkAuth.js";
import logger from "./logger.js";

export default {
  checkValidation: handleValidatorErrors,
  checkAuth,
  logger,
};
