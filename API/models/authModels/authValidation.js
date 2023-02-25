import { body } from "express-validator";

const register = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Неверный формат почты!")
    .isString()
    .withMessage("Неверный формат почты!")
    .isLength({ max: 255 })
    .withMessage("Длина почты не должна превышать 255 символов!"),
  body("password")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле password не должно быть пустым!")
    .isString()
    .withMessage("У поля password неверный тип данных!")
    .isLength({ min: 8 })
    .withMessage("Минимальная длина пароля 8 символов!")
    .isLength({ max: 30 })
    .withMessage("Максимальная длина пароля 30 символов!"),
  body("userName")
    .trim()
    .toLowerCase()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле userName не должно быть пустым!")
    .isString()
    .withMessage("У поля userName неверный тип данных!")
    .isLength({ min: 2, max: 15 })
    .withMessage(
      "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!"
    )
    .matches(/^([A-Za-zА-Яа-я]+)$/)
    .withMessage("Имя может содержать только латинские или русские буквы!"),
  body("nickName")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле nickName не должно быть пустым!")
    .isString()
    .withMessage("У поля nickName неверный тип данных!")
    .isLength({ min: 3, max: 16 })
    .withMessage(
      "Длина NickName не должна превышать 16 символов или быть меньше, чем 3 символа!"
    )
    .matches(/^([A-Za-z0-9_]+)$/)
    .withMessage(
      "NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!"
    ),
];
const login = [
  body("nickName")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле nickName не должно быть пустым!")
    .isString()
    .withMessage("У поля nickName неверный тип данных!")
    .isLength({ min: 3, max: 16 })
    .withMessage(
      "Длина NickName не должна превышать 16 символов или быть меньше, чем 3 символа!"
    )
    .matches(/^([A-Za-z0-9_]+)$/)
    .withMessage(
      "NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!"
    ),

  body("password")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле password не должно быть пустым!")
    .isString()
    .withMessage("У поля password неверный тип данных!")
    .isLength({ min: 8 })
    .withMessage("Минимальная длина пароля 8 символов!")
    .isLength({ max: 30 })
    .withMessage("Максимальная длина пароля 30 символов!"),
];
const confirm = [
  body("key")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Ключ отсутсвует!")
    .isString()
    .withMessage("Неверный тип ключа!"),
];

export default {
  register,
  login,
  confirm,
};
