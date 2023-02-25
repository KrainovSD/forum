import { validationResult } from 'express-validator';

export default (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errorsObject = {};
    Object.values(errors.errors).forEach((err) => {
      if (/\[\d]$/.test(err.param)) {
        let param = err.param.replace(/\[\d]$/, '');
        let index = err.param.replace(param, '').replace(/\[|]/g, '');
        index = +index + 1;
        if (!errorsObject?.[param]) errorsObject[param] = {};
        if (!errorsObject?.[param]?.[index]) {
          errorsObject[param][index] = `${index} ячейка: ${err.msg}`;
          return;
        }
        errorsObject[param][index] += ` ${err.msg}`;
        return;
      }
      let param = err.param;
      if (!errorsObject?.[param]) {
        errorsObject[param] = `${param.toUpperCase()}  ${err.msg}`;
        return;
      }
      errorsObject[param] += ` ${err.msg}`;
      return;
    });

    let errorsMessage = '';
    Object.keys(errorsObject).forEach((key) => {
      if (typeof errorsObject[key] == 'object') {
        let multiErrors = {};
        Object.values(errorsObject[key]).forEach((value) => {
          if (!multiErrors?.[key]) {
            multiErrors[key] = `${key.toUpperCase()} | ${value}`;
            return;
          }
          multiErrors[key] += ` ${value}`;
          return;
        });

        if (errorsMessage == '') {
          errorsMessage = multiErrors[key];
          return;
        }
        errorsMessage += ` ${multiErrors[key]}`;
        return;
      }
      if (errorsMessage == '') {
        errorsMessage = `${errorsObject[key]}`;
        return;
      }
      errorsMessage += ` ${errorsObject[key]}`;
      return;
    });
    req.errorMessage = errorsMessage;
    return res.status(400).json({ message: errorsMessage });
  }
  next();
};
