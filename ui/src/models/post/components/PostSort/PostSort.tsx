import "./PostSort.scss";
import arrowDown from "../../../../assets/media/arrow-down.png";
import checkMark from "../../../../assets/media/check-mark.png";
import { CSSTransition } from "react-transition-group";
import { useState } from "react";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { typePostSearch } from "../../../../models/post/types/types";

export const PostSort: React.FC = () => {
  const [search, setSearch] = useCustomSearchParams() as typePostSearch;

  const filtersOption = [
    { tag: "last-update", caption: "Последние обновления" },
    { tag: "title", caption: "Заголовок" },
    { tag: "last-date-create", caption: "Дата создания" },
    { tag: "most-view", caption: "Самые просматриваемые" },
    { tag: "most-comment", caption: "Больше ответов" },
  ];

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
    <div className="post-nav-bar__sort">
      <div className="post-nav-bar__button _icon" onClick={toggleTooltip}>
        <p>СОРТИРОВКА</p>
        <img src={arrowDown} alt="" />
      </div>
      <CSSTransition
        in={isVisibleTooltip}
        timeout={300}
        classNames="post-sort-anim"
        unmountOnExit
      >
        <div className="post-nav-bar__sort-tooltip">
          {filtersOption.map((filter) => (
            <div
              className="post-nav-bar__sort-item"
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
