import { body } from "express-validator";

const create = [
  body("title")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!")
    .isLength({ min: 2, max: 40 })
    .withMessage(
      "Поле должно стостоять не менее чем из 5 символов и не более чем из 60!"
    )
    .matches(/^([А-Яа-я0-9 ,.?!-]+)$/)
    .withMessage(
      "Поле должно состоять из букв русского или английского алфавита, цифр и знаков препинания!"
    ),
  body("parentID")
    .trim()
    .custom((value) => {
      if (value === 0) throw new Error();
      if (value === "null" || typeof +value === "number") return true;
    }),
  body("access")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isBoolean()
    .withMessage("У поля неверный тип данных!"),
];
const update = [
  body("topicID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
  body("title")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!")
    .isLength({ min: 2, max: 40 })
    .withMessage(
      "Поле должно стостоять не менее чем из 2 символов и не более чем из 40!"
    )
    .matches(/^([А-Яа-я0-9 ,.?!-]+)$/)
    .withMessage(
      "Поле должно состоять из букв русского алфавита, цифр и знаков препинания!"
    ),
  body("parentID")
    .trim()
    .custom((value) => {
      if (value === 0) throw new Error();
      if (value === "null" || typeof +value === "number") return true;
    }),
  body("access")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isBoolean()
    .withMessage("У поля неверный тип данных!"),
];
const updateValue = [
  body("value")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isBoolean()
    .withMessage("У поля неверный тип данных!"),
  body("topicID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
];

export default {
  update,
  updateValue,
  create,
};
