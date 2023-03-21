import { HOST } from "./../devConst";
import userAvatar from "../assets/media/user.png";

const PRODUCTION = process.env.NODE_ENV === "production" ? true : false;

export const getAvatar = (
  avatar: string | null | undefined,
  id: string | null | undefined
) => {
  const link = PRODUCTION
    ? `/uploads/userImg/${id}/${avatar}`
    : `${HOST}/uploads/userImg/${id}/${avatar}`;

  return avatar && avatar.length > 0 && id ? link : userAvatar;
};
