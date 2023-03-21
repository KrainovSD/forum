import backProfile from "../assets/media/back-profile.png";
import { HOST } from "./../devConst";
const PRODUCTION = process.env.NODE_ENV === "production" ? true : false;

export const getBackImg = (
  img: string | null | undefined,
  id: string | null | undefined
) => {
  const link = PRODUCTION
    ? `/uploads/userImg/${id}/${img}`
    : `${HOST}uploads/userImg/${id}/${img}`;

  return img && img.length > 0 && id ? link : backProfile;
};
