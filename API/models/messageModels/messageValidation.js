import { body } from "express-validator";

const create = [
  body("body")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
  body("members")
    .custom((value) => {
      if (value.length == 0) throw new Error("Список получаетелей пуст!");
      return true;
    })
    .withMessage("id не должно быть пустым!"),
  body("members.*")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Некорректный id получателя!")
    .isNumeric()
    .withMessage("Некорректный id получателя!"),
];
const update = [
  body("body")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isString()
    .withMessage("У поля неверный тип данных!"),
  body("messageID")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Поле не должно быть пустым!")
    .isNumeric()
    .withMessage("У поля неверный тип данных!"),
];
export default { create, update };
