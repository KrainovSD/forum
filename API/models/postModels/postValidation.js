import { body } from "express-validator";

const create = [
  body("title")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
  body("topicID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
];
const update = [
  body("title")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
  body("value")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isBoolean()
    .withMessage("У поля неверный тип данных!"),
  body("postID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
];

export default {
  create,
  update,
};
