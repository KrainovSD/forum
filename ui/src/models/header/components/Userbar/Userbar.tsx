import arrowDown from "../../../../assets/media/arrow-down.png";
import plus from "../../../../assets/media/plus.png";
import user from "../../../../assets/media/user.png";
import "./Userbar.scss";

export const Userbar: React.FC = () => {
  return (
    <div className="userBar">
      <div className="userBar__img-container" data-tooltip="Профиль">
        <img src={user} alt="" className="userBar__img" />
      </div>
      <div className="userBar__nickName" data-tooltip="Меню">
        <p>Serega_Krainov48</p>
        <img src={arrowDown} alt="" className="userBar__arrow" />
      </div>
      <div className="userBar__newContent" data-tooltip="Создать новый контент">
        <img src={plus} alt="" className="userBar__plus" />
        <p>Добавить</p>
        <img src={arrowDown} alt="" className="userBar__arrow" />
      </div>
      <div className="userBar__notice" data-tooltip="Уведомления">
        <div className="userBar__noticeImg"></div>
      </div>
      <div className="userBar__chat" data-tooltip="Личные сообщения">
        <div className="userBar__chatImg"></div>
      </div>
    </div>
  );
};
