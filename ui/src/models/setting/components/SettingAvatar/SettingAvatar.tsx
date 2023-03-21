import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { UploadImage } from "../../../../components/UploadImage/UploadImage";
import "./SettingAvatar.scss";
import {
  updateAvatar,
  deleteAvatar,
} from "../../../../store/reducers/user/userActionCreator";
import { getAvatar } from "../../../../helpers/getAvatar";

interface ISettingAvatarProps {
  close: () => void;
}

export const SettingAvatar: React.FC<ISettingAvatarProps> = ({ close }) => {
  const dispatch = useAppDispatch();
  const { response, userInfo } = useAppSelector((state) => state.user);
  const { popup, setPopup } = usePopup();

  const removeAvatar = () => {
    dispatch(deleteAvatar());
  };
  const sendAvatar = (v: File) => {
    let formData = new FormData();
    formData.append("avatar", v);
    dispatch(updateAvatar(formData));
  };

  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Изображение", response, close);
  }, [response]);

  const avatar = getAvatar(userInfo?.avatar, userInfo?.id);

  return (
    <div className="back-drop__popup">
      {popup}
      <div className="setting-avatar">
        <h1 className="setting-avatar__header">Загрузите новый аватар</h1>
        <p className="setting-avatar__caption">
          Аватар может быть только формата png или gif, а так же весить не более
          5MB
        </p>
        {userInfo && userInfo.avatar.length > 0 && (
          <UploadImage
            maxSize={5 * 1024 * 1024}
            listAccessMimeType={["image/png", "image/gif"]}
            send={(v: File) => {
              sendAvatar(v);
            }}
            remove={removeAvatar}
            close={close}
            defaultImg={avatar}
          />
        )}
        {userInfo && userInfo.avatar.length === 0 && (
          <UploadImage
            maxSize={5 * 1024 * 1024}
            listAccessMimeType={["image/png", "image/gif"]}
            send={(v: File) => {
              sendAvatar(v);
            }}
            close={close}
            defaultImg={avatar}
          />
        )}
      </div>
    </div>
  );
};
