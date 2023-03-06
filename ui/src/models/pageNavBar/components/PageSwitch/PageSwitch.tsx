import { useEffect, useState } from "react";
import { InputWarn } from "../../../../components/UI/InputWarn/InputWarn";
import "./PageSwitch.scss";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import arrowDown from "../../../../assets/media/arrow-down.png";
import { CSSTransition } from "react-transition-group";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { typeSearch } from "../../../../models/pageNavBar/types";

interface IPageSwitchProps {
  maxPage: number;
}

export const PageSwitch: React.FC<IPageSwitchProps> = ({ maxPage }) => {
  const [search, setSearch] = useCustomSearchParams() as typeSearch;
  const page = +search.page;

  const [switchPageTo, setSwitchPageTo] = useState<number>(0);
  const [errorPageTo, setErrorPageTo] = useState<string>("");
  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false);
  const toggleTooltip = () => {
    const visible = isVisibleTooltip ? false : true;
    setIsVisibleTooltip(visible);
  };

  const checkPageTo = () => {
    if (switchPageTo > maxPage)
      setErrorPageTo(`Значение должно быть меньше или равно ${maxPage}`);
    else setErrorPageTo(``);
  };
  useEffect(checkPageTo, [switchPageTo]);

  const setPage = () => {
    if (errorPageTo.length !== 0) return;

    setSearch({ ...search, page: `${switchPageTo}` });
    toggleTooltip();
  };

  if (maxPage <= 1) return <div></div>;

  return (
    <div className="page-nav-bar__page-change">
      <div className="_active" onClick={toggleTooltip}>
        <p>
          Страница {page} из {maxPage}
        </p>
        <img src={arrowDown} alt="" />
      </div>
      <CSSTransition
        in={isVisibleTooltip}
        timeout={300}
        classNames="page-change-anim"
        unmountOnExit
      >
        <div className="_tooltip">
          <InputWarn
            error={errorPageTo}
            type="number"
            value={switchPageTo}
            setValue={(v: number) => setSwitchPageTo(v)}
            title="Номер страницы"
          />

          <BlackButton
            onClick={() => {
              setPage();
            }}
          >
            Поехали
          </BlackButton>
        </div>
      </CSSTransition>
    </div>
  );
};
