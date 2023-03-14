import { body } from "express-validator";

const updateNickName = [
  body("nickName")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
];
const updateUserName = [
  body("userName")
    .trim()
    .toLowerCase()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
];
const updatePassword = [
  body("password")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле  не должно быть пустым!")
    .isString()
    .withMessage("У поля  неверный тип данных!")
    .isLength({ min: 8 })
    .withMessage("Минимальная длина  8 символов!")
    .isLength({ max: 30 })
    .withMessage("Максимальная длина  30 символов!"),
  body("key")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля  неверный тип данных!"),
];
const updateEmail = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Неверный формат почты!")
    .isString()
    .withMessage("Неверный формат почты!")
    .isLength({ max: 255 })
    .withMessage("Длина почты не должна превышать 255 символов!"),
  body("key")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля  неверный тип данных!"),
];

export default { updateNickName, updateUserName, updatePassword, updateEmail };
