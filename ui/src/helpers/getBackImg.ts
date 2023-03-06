import backProfile from "../assets/media/back-profile.png";

export const getBackImg = (img: string | null | undefined) => {
  return img ? "путь" : backProfile;
};
