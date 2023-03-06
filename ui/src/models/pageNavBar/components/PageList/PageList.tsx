import "./PageList.scss";
import doubleRight from "../../../../assets/media/double-rigth.png";
import doubleLeft from "../../../../assets/media/double-left.png";
import { useMemo } from "react";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { typeSearch } from "../../../../models/pageNavBar/types";

interface IPageListProps {
  maxPage: number;
}
export const PageList: React.FC<IPageListProps> = ({ maxPage }) => {
  const [search, setSearch] = useCustomSearchParams() as typeSearch;
  const page = +search.page;

  const pageArray = useMemo(() => {
    return new Array(maxPage + 1).fill(0);
  }, [maxPage, search.page]);

  const setPage = (value: number) => {
    setSearch({ ...search, page: `${value}` });
  };

  if (maxPage <= 1) return <div></div>;

  return (
    <div className="page-nav-bar__page">
      {page > 1 && (
        <div
          className="page-nav-bar__button _icon"
          onClick={() => {
            setPage(1);
          }}
        >
          <img src={doubleLeft} alt="" />
        </div>
      )}
      {page > 1 && (
        <div
          className="page-nav-bar__button"
          onClick={() => {
            setPage(page - 1);
          }}
        >
          НАЗАД
        </div>
      )}

      {pageArray.map((item, index) => {
        if (index !== 0 && page - index <= 5 && index - page <= 5)
          return (
            <div
              className={`page-nav-bar__button ${
                index == page ? "_selected" : ""
              }`}
              key={index}
              onClick={() => {
                setPage(index);
              }}
            >
              {index}
            </div>
          );
      })}

      {page < maxPage && (
        <div
          className="page-nav-bar__button"
          onClick={() => {
            setPage(page + 1);
          }}
        >
          ДАЛЕЕ
        </div>
      )}
      {page < maxPage && (
        <div
          className="page-nav-bar__button _icon"
          onClick={() => {
            setPage(maxPage);
          }}
        >
          <img src={doubleRight} alt="" />
        </div>
      )}
    </div>
  );
};
