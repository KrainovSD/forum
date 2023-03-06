import "./Profile.scss";
import { ProfileActivities } from "./components/ProfileActivities/ProfileActivities";
import { ProfileHeader } from "./components/ProfileHeader/ProfileHeader";
import { ProfileInfo } from "./components/ProfileInfo/ProfileInfo";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect, useMemo } from "react";
import { getUserByID } from "../../store/reducers/user/userActionCreator";

export const Profile: React.FC = () => {
  const { id } = useParams();

  const { userInfo, selectedUserInfo } = useAppSelector((state) => state.user);
  const isOwnProfile = useMemo(() => {
    const userID = userInfo ? `${userInfo.id}` : null;
    if (!userID || id !== userID) return false;
    return true;
  }, [id, userInfo?.id]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!isOwnProfile && id) {
      dispatch(getUserByID(id));
    }
  }, [isOwnProfile]);

  return (
    <div className="profile">
      {((userInfo && isOwnProfile) || (selectedUserInfo && !isOwnProfile)) && (
        <div className="">
          {isOwnProfile && userInfo && (
            <ProfileHeader user={userInfo} isOwnProfile={isOwnProfile} />
          )}
          {!isOwnProfile && selectedUserInfo && (
            <ProfileHeader
              user={selectedUserInfo}
              isOwnProfile={isOwnProfile}
            />
          )}

          <div className="profile__content">
            {isOwnProfile && userInfo && (
              <ProfileInfo user={userInfo} isOwnProfile={isOwnProfile} />
            )}
            {!isOwnProfile && selectedUserInfo && (
              <ProfileInfo
                user={selectedUserInfo}
                isOwnProfile={isOwnProfile}
              />
            )}
            <ProfileActivities />
          </div>
        </div>
      )}
    </div>
  );
};
