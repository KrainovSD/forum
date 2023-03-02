import "./Profile.scss";
import { ProfileActivities } from "./components/ProfileActivities/ProfileActivities";
import { ProfileHeader } from "./components/ProfileHeader/ProfileHeader";
import { ProfileInfo } from "./components/ProfileInfo/ProfileInfo";

export const ProfileOwn: React.FC = () => {
  return (
    <div className="profile">
      <ProfileHeader />
      <div className="profile__content">
        <ProfileInfo />
        <ProfileActivities />
      </div>
    </div>
  );
};
