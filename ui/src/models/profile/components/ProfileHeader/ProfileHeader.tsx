import "./ProfileHeader.scss";
import imgBlack from "../../../../assets/media/img-black.png";
import imgWhite from "../../../../assets/media/img-white.png";
import arrowDown from "../../../../assets/media/arrow-down.png";
import newsPaper from "../../../../assets/media/newspaper.png";
import { getBackImg } from "../../../../helpers/getBackImg";
import { getAvatar } from "../../../../helpers/getAvatar";
import { getRoleInfo } from "../../../../helpers/getRoleInfo";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { ISelectedUserInfo, IUserInfo } from "store/reducers/user/userTypes";
import { NavLink, useLocation } from "react-router-dom";
import { getUserContentLink, getUserLink } from "../../../../helpers/getLinks";
import { SettingAvatar } from "../../../../models/setting/components/SettingAvatar/SettingAvatar";
import { useState } from "react";
import { Animation } from "../../../../components/Animation/Animation";
import { SettingBackImg } from "../../../../models/setting/components/SettingBackImg/SettingBackImg";

interface IProfileHeaderProps {
  user: IUserInfo | ISelectedUserInfo;
  isOwnProfile: boolean;
}

export const ProfileHeader: React.FC<IProfileHeaderProps> = ({
  user,
  isOwnProfile,
}) => {
  const backProfileImg = getBackImg(user.backImg, user.id);
  const avatar = getAvatar(user.avatar, user.id);
  const { roleString, roleClass } = getRoleInfo(user.role);
  const lastLoginDate = useDateFormat(user.lastLogin);
  const dateRegistration = useDateFormat(user.dateRegistration);

  const location = useLocation();
  const option = location.pathname.split("/")[2];

  const [isVisibleAvatarPopup, setIsVisibleAvatarPopup] = useState(true);
  const [isVisibleBackImgPopup, setIsVisibleBackImgPopup] = useState(false);

  return (
    <div
      className="profile-header"
      style={{ backgroundImage: `url(${backProfileImg})` }}
    >
      <Animation isVisible={isVisibleAvatarPopup} className={"appear-anim"}>
        <SettingAvatar
          close={() => {
            setIsVisibleAvatarPopup(false);
          }}
        />
      </Animation>
      <Animation isVisible={isVisibleBackImgPopup} className={"appear-anim"}>
        <SettingBackImg
          close={() => {
            setIsVisibleBackImgPopup(false);
          }}
        />
      </Animation>

      {isOwnProfile && (
        <div
          className="profile-header__background-switch"
          data-tooltip="Обложка профиля"
          onClick={() => {
            setIsVisibleBackImgPopup(true);
          }}
        >
          <img src={imgWhite} alt="" className="profile-header__back-icon" />
          <p>Обложка</p>
        </div>
      )}
      <div className="profile-header__user-info">
        <div className="profile-header__user-info-avatar">
          <img src={avatar} alt="" className="avatar" />
          {isOwnProfile && (
            <div
              className="switch-avatar"
              data-tooltip="Фотография профиля"
              onClick={() => {
                setIsVisibleAvatarPopup(true);
              }}
            >
              <img src={imgBlack} alt="" />
            </div>
          )}
        </div>
        <div className="profile-header__user-info-body">
          <h1>{user.nickName}</h1>
          <p className={`_role ${roleClass}`}>{roleString}</p>
        </div>
      </div>

      <div className="profile-header__info-bar">
        <div className="profile-header__info-bar-item">
          <h1>ПУБЛИКАЦИЙ</h1>
          <p>{user.countComment}</p>
        </div>
        <div className="profile-header__info-bar-item">
          <h1>ЗАРЕГИСТРИРОВАН</h1>
          <p>{dateRegistration}</p>
        </div>
        <div className="profile-header__info-bar-item">
          <h1>ПОСЕЩЕНИЕ</h1>
          <p>
            <span className="_cirle green"></span> {lastLoginDate}
          </p>
        </div>
        {option === "info" && (
          <NavLink
            to={getUserContentLink(user.id, "comments")}
            className="profile-header__find-content-button"
          >
            <img src={newsPaper} alt="" />
            <p>{isOwnProfile ? "Мой контент" : "Пользовательский контент"}</p>
          </NavLink>
        )}
        {option === "content" && (
          <NavLink
            to={getUserLink(user.id)}
            className="profile-header__find-content-button"
          >
            <img src={newsPaper} alt="" />
            <p>{isOwnProfile ? "Мой профиль" : "Пользовательский профиль"}</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};
