import "./ProfileInfo.scss";
import arrowRight from "../../../../assets/media/arrow-right.png";
import { getAvatar } from "../../../../helpers/getAvatar";
import { IUserInfoProp } from "../../../../models/profile/types/UserInfo";
import { getReputationCaption } from "../../../../helpers/getCaption";

interface IProfileInfoProps {
  user: IUserInfoProp;
  isOwnProfile: boolean;
}
export const ProfileInfo: React.FC<IProfileInfoProps> = ({
  user,
  isOwnProfile,
}) => {
  const avatar = getAvatar(user.avatar);
  const reputationCaption = getReputationCaption(user.reputation);

  return (
    <div className="profile-info">
      <div className="profile-info__reputation">
        <div className="profile-info__reputation-back-ground">
          <h2>РЕПУТАЦИЯ</h2>
          <h3>{user.reputation}</h3>
          <p>{reputationCaption}</p>
        </div>
        <div className="profile-info__reputation-tracker">
          <div>
            <p>История репутации</p>
            <img src={arrowRight} alt="" />
          </div>
        </div>
      </div>
      <div className="profile-info__subscribers" data-tooltip="В разработке">
        <div className="profile-info__subscribers-wrapper">
          <div className="profile-info__subscribers-header">
            <p>0 Подписчиков</p>
          </div>
          <div className="profile-info__subscribers-list">
            <div className="profile-info__subscribers-item">
              <img src={avatar} alt="" />
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
