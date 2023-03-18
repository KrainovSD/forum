import "./PageFilter.scss";
import arrowDown from "../../../../assets/media/arrow-down.png";
import checkMark from "../../../../assets/media/check-mark.png";
import { CSSTransition } from "react-transition-group";
import { useState } from "react";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { typeSearch } from "models/pageNavBar/types";
import { IFilterOptions } from "models/pageNavBar/PageNavBar";

interface IPageFilterProps {
  filterOptions: IFilterOptions[];
}

export const PageFilter: React.FC<IPageFilterProps> = ({ filterOptions }) => {
  const [search, setSearch] = useCustomSearchParams() as typeSearch;

  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false);
  const toggleTooltip = () => {
    const visible = isVisibleTooltip ? false : true;
    setIsVisibleTooltip(visible);
  };
  const setFilter = (value: string) => {
    setSearch({ ...search, filter: value });
    toggleTooltip();
  };

  return (
    <div className="page-nav-bar__sort">
      <div className="page-nav-bar__button _icon" onClick={toggleTooltip}>
        <p>СОРТИРОВКА</p>
        <img src={arrowDown} alt="" />
      </div>
      <CSSTransition
        in={isVisibleTooltip}
        timeout={300}
        classNames="page-sort-anim"
        unmountOnExit
      >
        <div className="page-nav-bar__sort-tooltip">
          {filterOptions.map((filter) => (
            <div
              className="page-nav-bar__sort-item"
              key={filter.tag}
              onClick={() => {
                setFilter(filter.tag);
              }}
            >
              {search.filter !== filter.tag && <div className="_circle"></div>}
              {search.filter === filter.tag && <img src={checkMark} alt="" />}
              <p>{filter.caption}</p>
            </div>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
};
