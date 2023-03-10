import { body } from "express-validator";

const create = [
  body("body")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
];
export default { create };
