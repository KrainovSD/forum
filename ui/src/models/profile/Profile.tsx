import "./Profile.scss";
import { ProfileHeader } from "./components/ProfileHeader/ProfileHeader";
import { Outlet, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect, useMemo } from "react";
import {
  getMyUserInfo,
  getUserByID,
} from "../../store/reducers/user/userActionCreator";
import { useEffectOnlyUpdate } from "../../hooks/useResponse";

export const Profile: React.FC = () => {
  const { updated: isCommentUpdate } = useAppSelector((state) => state.comment);
  const { updated: isPostUpdate } = useAppSelector((state) => state.post);
  const { updated: isLikeUpdate } = useAppSelector((state) => state.like);

  const { id } = useParams();
  const { userInfo, selectedUserInfo } = useAppSelector((state) => state.user);
  const isOwnProfile = useMemo(() => {
    const userID = userInfo ? `${userInfo.id}` : null;
    if (!userID || id !== userID) return false;
    return true;
  }, [id, userInfo?.id]);

  const dispatch = useAppDispatch();
  const getUserInfo = () => {
    if (!isOwnProfile && id) {
      dispatch(getUserByID(id));
    }
    if (isOwnProfile) {
      dispatch(getMyUserInfo());
    }
  };
  useEffect(getUserInfo, [isOwnProfile, id]);

  useEffectOnlyUpdate(() => {
    if (isCommentUpdate) getUserInfo();
  }, [isCommentUpdate]);
  useEffectOnlyUpdate(() => {
    if (isPostUpdate) getUserInfo();
  }, [isPostUpdate]);
  useEffectOnlyUpdate(() => {
    if (isLikeUpdate) getUserInfo();
  }, [isLikeUpdate]);

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
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};
