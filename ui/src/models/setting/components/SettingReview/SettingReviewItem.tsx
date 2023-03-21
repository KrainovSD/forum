import "./SettingReview.scss";

interface ISettingReviewItemProps {
  title: string;
  caption: string;
  action: () => void;
}

export const SettingReviewItem: React.FC<ISettingReviewItemProps> = ({
  title,
  caption,
  action,
}) => {
  return (
    <div className="setting-review__item">
      <div className="setting-review__info-wrapper">
        <h1 className="setting-review__header">{title}</h1>
        <p className="setting-review__title">{caption}</p>
      </div>
      <div className="setting-review__change-button" onClick={() => action()}>
        Изменить
      </div>
    </div>
  );
};
