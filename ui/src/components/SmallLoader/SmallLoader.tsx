import "./SmallLoader.scss";

export const SmallLoader: React.FC = () => {
  return (
    <div className="back-drop__small-loader">
      <div className="small-loader__wrapper">
        <div className="small-loader">
          <div className="small-loader__element one"></div>
          <div className="small-loader__element two"></div>
          <div className="small-loader__element three"></div>
        </div>
      </div>
    </div>
  );
};
