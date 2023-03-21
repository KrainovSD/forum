import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/redux";
import { ProfileActivities } from "../ProfileActivities/ProfileActivities";
import { ProfileInfo } from "../ProfileInfo/ProfileInfo";
import "./UserInfo.scss";

export const UserInfo: React.FC = () => {
  const { userInfo, selectedUserInfo } = useAppSelector((state) => state.user);
  const { id } = useParams();
  const isOwnProfile = useMemo(() => {
    const userID = userInfo ? `${userInfo.id}` : null;
    if (!userID || id !== userID) return false;
    return true;
  }, [id, userInfo?.id]);

  return (
    <div className="user-info">
      {isOwnProfile && userInfo && <ProfileInfo user={userInfo} />}
      {!isOwnProfile && selectedUserInfo && (
        <ProfileInfo user={selectedUserInfo} />
      )}
      {isOwnProfile && userInfo && <ProfileActivities user={userInfo} />}
      {!isOwnProfile && selectedUserInfo && (
        <ProfileActivities user={selectedUserInfo} />
      )}
    </div>
  );
};
