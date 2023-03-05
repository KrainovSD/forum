export const getRoleInfo = (role: string) => {
  switch (role) {
    case "noob": {
      return ["Пользователь", "_noob"];
    }
    case "user": {
      return ["Продвинутый", "_user"];
    }
    case "moder": {
      return ["Модератор", "_moder"];
    }
    case "admin": {
      return ["Администратор", "_admin"];
    }
    default: {
      return ["Пользователь", "_noob"];
    }
  }
};
