import "./ProfileHeader.scss";
import imgBlack from "../../../../assets/media/img-black.png";
import imgWhite from "../../../../assets/media/img-white.png";
import arrowDown from "../../../../assets/media/arrow-down.png";
import newsPaper from "../../../../assets/media/newspaper.png";
import { getBackImg } from "../../../../helpers/getBackImg";
import { IUserInfoProp } from "../../../../models/profile/types/UserInfo";
import { getAvatar } from "../../../../helpers/getAvatar";
import { getRoleInfo } from "../../../../helpers/getRoleInfo";
import { useDateFormat } from "../../../../hooks/useDateFormat";

interface IProfileHeaderProps {
  user: IUserInfoProp;
  isOwnProfile: boolean;
}

export const ProfileHeader: React.FC<IProfileHeaderProps> = ({
  user,
  isOwnProfile,
}) => {
  const backProfileImg = getBackImg(user.backImg);
  const avatar = getAvatar(user.avatar, user.id);
  const { roleString, roleClass } = getRoleInfo(user.role);
  const lastLoginDate = useDateFormat(user.lastLogin);
  const dateRegistration = useDateFormat(user.dateRegistration);

  return (
    <div
      className="profile-header"
      style={{ backgroundImage: `url(${backProfileImg})` }}
    >
      <div className="profile-header__background-switch">
        <img src={imgWhite} alt="" className="profile-header__back-icon" />
        <p>Обложка</p>
        <img src={arrowDown} alt="" className="profile-header__arrow-down" />
      </div>
      <div className="profile-header__user-info">
        <div className="profile-header__user-info-avatar">
          <img src={avatar} alt="" className="avatar" />
          <div className="switch-avatar">
            <img src={imgBlack} alt="" />
          </div>
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
        <div className="profile-header__find-content-button">
          <img src={newsPaper} alt="" />
          <p>Мой контент</p>
        </div>
      </div>
    </div>
  );
};
