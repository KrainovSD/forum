import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ISelectedUserInfo, IUserInfo } from "store/reducers/user/userTypes";
import { UserActivityItem } from "../UserActivityItem/UserActiviryItem";
import "./ProfileActivities.scss";
import { getUserContent } from "../../../../store/reducers/user/userActionCreator";
import { useEffect, useState } from "react";

interface IProfileActivitiesProps {
  user: IUserInfo | ISelectedUserInfo;
}

export const ProfileActivities: React.FC<IProfileActivitiesProps> = ({
  user,
}) => {
  const dispath = useAppDispatch();
  const { userContent } = useAppSelector((state) => state.user);
  const getContent = () => {
    dispath(getUserContent(user.id));
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <div className="profile-activities">
      {userContent.length === 0 && (
        <div className="not-found">Контент не обнаружен</div>
      )}
      {userContent.map((item, index) => (
        <UserActivityItem
          content={item}
          userAvatar={user.avatar}
          userID={user.id}
          key={item.comment.id}
        />
      ))}
    </div>
  );
};
