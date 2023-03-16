import { body } from "express-validator";

const create = [
  body("body")
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
  body("title")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!")
    .isLength({ min: 5, max: 60 })
    .withMessage(
      "Поле должно стостоять не менее чем из 5 символов и не более чем из 60!"
    )
    .matches(/^([A-Za-zА-Яа-я0-9 ,.?!-]+)$/)
    .withMessage(
      "Поле должно состоять из букв русского или английского алфавита, цифр и знаков препинания!"
    ),
  body("topicID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
];
const updateTitle = [
  body("title")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!")
    .isLength({ min: 5, max: 60 })
    .withMessage(
      "Поле должно стостоять не менее чем из 5 символов и не более чем из 60!"
    )
    .matches(/^([A-Za-zА-Яа-я0-9 ,.?!-]+)$/)
    .withMessage(
      "Поле должно состоять из букв русского или английского алфавита, цифр и знаков препинания!"
    ),
  body("postID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
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
  updateTitle,
  updateValue,
};
