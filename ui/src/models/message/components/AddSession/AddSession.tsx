import { AddMessage } from "../AddMessage/AddMessage";
import "./AddSession.scss";
import { useState, useEffect, useMemo } from "react";
import {
  IMultiSelectUserItem,
  MultiSelectUser,
} from "../../../../components/UI/MultiSelectUser/MultiSelectUser";
import { axiosInstanceToken } from "../../../../helpers/axiosInstanceToken";
import useFetching from "../../../../hooks/useFetching";
import { usePopup } from "../../../../hooks/usePopup";
import cancel from "../../../../assets/media/cancel.png";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { useAppSelector } from "../../../../hooks/redux";

interface IAddSessionProps {
  close: () => void;
}

export const AddSession: React.FC<IAddSessionProps> = ({ close }) => {
  const { updated } = useAppSelector((state) => state.message);

  const [members, setMembers] = useState<IMultiSelectUserItem[]>([]);
  const [users, setUsers] = useState<IMultiSelectUserItem[]>([]);
  const changeMembers = (v: IMultiSelectUserItem) => {
    const index = members.findIndex((member) => member.id == v.id);
    if (index !== -1) {
      const newMembers = members.filter((member) => member.id != v.id);
      setMembers([...newMembers]);
    } else setMembers([...members, v]);
  };
  const membersID: string[] = useMemo(() => {
    const membersID: string[] = [];

    for (const member of members) {
      membersID.push(`${member.id}`);
    }
    return membersID;
  }, [members]);

  const getUserList = async () => {
    const response = await axiosInstanceToken.get<IMultiSelectUserItem[]>(
      "api/user/list"
    );
    setUsers([...response.data]);
  };
  const { popup, setPopup } = usePopup();
  const { fetching, isLoading } = useFetching(
    getUserList,
    setPopup,
    "Список пользователей",
    close
  );
  useEffect(() => {
    fetching();
  }, []);

  useEffectOnlyUpdate(() => {
    if (updated) close();
  }, [updated]);

  return (
    <div className="back-drop__popup">
      <div className="add-session">
        {popup}
        <img
          src={cancel}
          alt=""
          onClick={close}
          className="add-session__close"
        />
        <h1 className="add-session__header">
          Выберите пользователей, которым хотите отправить сообщение
        </h1>
        <div className="add-session__select-wrapper">
          <p>Список пользователей</p>
          <MultiSelectUser
            selectItems={users}
            selectValue={membersID}
            setSelectValue={changeMembers}
            isLoading={isLoading}
          />
        </div>

        <div className="add-session__selected-user">
          {members.map((item) => (
            <div className="add-session__selected-user-item" key={item.id}>
              {item.nickName}
              <img
                src={cancel}
                alt=""
                onClick={() => {
                  changeMembers(item);
                }}
              />
            </div>
          ))}
        </div>
        <AddMessage defaultMembers={membersID} />
      </div>
    </div>
  );
};
