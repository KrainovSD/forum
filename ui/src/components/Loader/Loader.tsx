import "./Loader.scss";

export const Loader: React.FC = () => {
  return (
    <div className="back-drop__loader">
      <div className="loader__wrapper">
        <div className="loader">
          <div className="loader__element one"></div>
          <div className="loader__element two"></div>
          <div className="loader__element three"></div>
        </div>
      </div>
    </div>
  );
};
