import "./UploadImage.scss";
import { useState, useRef } from "react";

import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import { usePopup } from "../../hooks/usePopup";
import { useConfirm } from "../../hooks/useConfirm";

interface IUploadImageProps {
  maxSize: number;
  listAccessMimeType: string[];
  defaultImg: string;
  send: (v: File) => void;
  remove?: () => void;
  close: () => void;
}

export const UploadImage: React.FC<IUploadImageProps> = ({
  maxSize,
  listAccessMimeType,
  defaultImg,
  send,
  remove,
  close,
}) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [nameAvatar, setNameAvatar] = useState("");

  const { popup, setPopup } = usePopup();
  const { confirm, checkConfirm } = useConfirm();
  const checkFile = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      setError("");
      setAvatar("");
      setNameAvatar("");
      return;
    }
    if (!listAccessMimeType.includes(file.type)) {
      setError("Не верный формат!");
      e.currentTarget.value = "";
      setAvatar("");
      setNameAvatar("");
      return;
    }

    if (maxSize < file.size) {
      setError("Большой размер файла!");
      e.currentTarget.value = "";
      setAvatar("");
      setNameAvatar("");
      return;
    }
    setError("");

    if (!FileReader) return;
    let reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) return;
      const result = `${reader.result}`;
      const newImg = result.substring(result.indexOf(",") + 1);
      setAvatar(`data:image/png;base64,${newImg}`);
      setNameAvatar(file.name);
    };
    reader.readAsDataURL(file);
  };
  const sendFile = () => {
    if (!inputFile.current) return;
    const input = inputFile.current as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    checkConfirm(
      "Изображение",
      "Вы уверены, что хотите добавить изображение?",
      () => {
        send(file);
      }
    );
  };
  const removeFile = () => {
    checkConfirm(
      "Изображение",
      "Вы уверены, что хотите удалить ранее установленное изображение?",
      remove
    );
  };
  const clearFile = () => {
    if (!inputFile.current) return;
    const input = inputFile.current as HTMLInputElement;
    input.value = "";
    setError("");
    setAvatar("");
    setNameAvatar("");
  };

  const visibleAvatar = avatar.length > 0 ? avatar : defaultImg;
  const visibleButton = avatar.length > 0 && error.length === 0;

  return (
    <div className="upload-img">
      {popup}
      {confirm}
      <div className="upload-img__content-wrapper">
        <img src={visibleAvatar} alt="" />
        <div className="upload-img__tools-wrapper">
          <div className="upload-img__input-wrapper">
            <label className="upload-img__input-file">
              <input type="file" onChange={checkFile} ref={inputFile} />
              <span>Выбрать новый</span>
            </label>
            {nameAvatar && (
              <div className="upload-img__input-file-list">
                <p className="_item">{nameAvatar}</p>
                <p className="_remove" onClick={clearFile}>
                  x
                </p>
              </div>
            )}
          </div>

          {error.length > 0 && (
            <p className="upload-img__error" data-tooltip={error}>
              {error}
            </p>
          )}
          {remove && (
            <div className="upload-img__delete-button" onClick={removeFile}>
              {" "}
              Удалить текущий{" "}
            </div>
          )}
        </div>
      </div>
      <div className="upload-img__button-wrapper">
        <div className="_button">
          <BlackButton data-disabled={!visibleButton} onClick={sendFile}>
            Отправить
          </BlackButton>
        </div>
        <div className="_button">
          <BlackButton onClick={close}>Отмена</BlackButton>
        </div>
      </div>
    </div>
  );
};
