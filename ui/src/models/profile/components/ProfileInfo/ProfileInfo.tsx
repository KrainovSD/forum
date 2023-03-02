import "./ProfileInfo.scss";
import arrowRight from "../../../../assets/media/arrow-right.png";
import avatarUser from "../../../../assets/media/user.png";

export const ProfileInfo: React.FC = () => {
  //#a4a4a4
  return (
    <div className="profile-info">
      <div className="profile-info__reputation">
        <div className="profile-info__reputation-back-ground">
          <h2>РЕПУТАЦИЯ</h2>
          <h3>725</h3>
          <p>Ангел</p>
        </div>
        <div className="profile-info__reputation-tracker">
          <div>
            <p>История репутации</p>
            <img src={arrowRight} alt="" />
          </div>
        </div>
      </div>
      <div className="profile-info__subscribers">
        <div className="profile-info__subscribers-wrapper">
          <div className="profile-info__subscribers-header">
            <p>65 Подписчиков</p>
          </div>
          <div className="profile-info__subscribers-list">
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
            <div className="profile-info__subscribers-item">
              <img src={avatarUser} alt="" />
            </div>
          </div>
        </div>
        <div className="profile-info__subscribers-footer">
          <div className="profile-info__view-subscribers">
            <p>Смотреть всех подписчиков</p>
            <img src={arrowRight} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
