import "./ProfileHeader.scss";
import imgBlack from "../../../../assets/media/img-black.png";
import imgWhite from "../../../../assets/media/img-white.png";
import arrowDown from "../../../../assets/media/arrow-down.png";
import backProfile from "../../../../assets/media/back-profile.png";
import newsPaper from "../../../../assets/media/newspaper.png";
import avatar from "../../../../assets/media/user.png";

export const ProfileHeader: React.FC = () => {
  const backProfileImg = backProfile;

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
          <h1>Serega_Krainov47</h1>
          <p className="_user">Продвинутый</p>
        </div>
      </div>

      <div className="profile-header__info-bar">
        <div className="profile-header__info-bar-item">
          <h1>ПУБЛИКАЦИЙ</h1>
          <p>1647</p>
        </div>
        <div className="profile-header__info-bar-item">
          <h1>ЗАРЕГИСТРИРОВАН</h1>
          <p>9 августа, 2012</p>
        </div>
        <div className="profile-header__info-bar-item">
          <h1>ПОСЕЩЕНИЕ</h1>
          <p>
            <div className="_cirle green"></div> Только что
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
