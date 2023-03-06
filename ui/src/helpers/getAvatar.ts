import userAvatar from "../assets/media/user.png";

export const getAvatar = (avatar: string | null | undefined) => {
  return avatar ? "путь" : userAvatar;
};
