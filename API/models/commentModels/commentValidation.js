import { body } from "express-validator";

const create = [
  body("body")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
  body("postID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
  body("main")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isBoolean()
    .withMessage("У поля неверный тип данных!"),
];
const update = [
  body("body")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
  body("commentID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
  body("verified")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isBoolean()
    .withMessage("У поля неверный тип данных!"),
  body("fixed")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isBoolean()
    .withMessage("У поля неверный тип данных!"),
];

export default {
  create,
  update,
};
