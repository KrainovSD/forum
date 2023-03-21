import { getBackImg } from "../../../../helpers/getBackImg";
import { UploadImage } from "../../../../components/UploadImage/UploadImage";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import {
  deleteBackImg,
  updateBackImg,
} from "../../../../store/reducers/user/userActionCreator";
import "./SettingBackImg.scss";

interface ISettingBackImgProps {
  close: () => void;
}

export const SettingBackImg: React.FC<ISettingBackImgProps> = ({ close }) => {
  const dispatch = useAppDispatch();
  const { response, userInfo } = useAppSelector((state) => state.user);
  const { popup, setPopup } = usePopup();
  const removeBackImg = () => {
    dispatch(deleteBackImg());
  };
  const sendBackimg = (v: File) => {
    let formData = new FormData();
    formData.append("backImg", v);
    dispatch(updateBackImg(formData));
  };

  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Изображение", response, close);
  }, [response]);

  const backImg = getBackImg(userInfo?.backImg, userInfo?.id);

  return (
    <div className="back-drop__popup">
      {popup}
      <div className="setting-avatar">
        <h1 className="setting-avatar__header">Загрузите новую обложку</h1>
        <p className="setting-avatar__caption">
          Аватар может быть только формата png или gif, а так же весить не более
          5MB
        </p>
        {userInfo && userInfo.backImg.length > 0 && (
          <UploadImage
            maxSize={5 * 1024 * 1024}
            listAccessMimeType={["image/png", "image/gif"]}
            send={(v: File) => {
              sendBackimg(v);
            }}
            remove={removeBackImg}
            close={close}
            defaultImg={backImg}
          />
        )}
        {userInfo && userInfo.backImg.length === 0 && (
          <UploadImage
            maxSize={5 * 1024 * 1024}
            listAccessMimeType={["image/png", "image/gif"]}
            send={(v: File) => {
              sendBackimg(v);
            }}
            close={close}
            defaultImg={backImg}
          />
        )}
      </div>
    </div>
  );
};
