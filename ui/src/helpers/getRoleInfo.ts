export const getRoleInfo = (role: string) => {
  switch (role) {
    case "noob": {
      return { roleString: "Пользователь", roleClass: "_noob" };
    }
    case "user": {
      return { roleString: "Продвинутый", roleClass: "_user" };
    }
    case "moder": {
      return { roleString: "Модератор", roleClass: "_moder" };
    }
    case "admin": {
      return { roleString: "Администратор", roleClass: "_admin" };
    }
    default: {
      return { roleString: "Пользователь", roleClass: "_noob" };
    }
  }
};
