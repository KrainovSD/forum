import "./PostPageList.scss";
import doubleRight from "../../../../assets/media/double-rigth.png";
import doubleLeft from "../../../../assets/media/double-left.png";
import { useAppSelector } from "../../../../hooks/redux";
import { useMemo } from "react";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { typePostSearch } from "../../types/types";

export const PostPageList = () => {
  const [search, setSearch] = useCustomSearchParams() as typePostSearch;
  const page = +search.page;
  const { maxPage } = useAppSelector((state) => state.post);

  const pageArray = useMemo(() => {
    return new Array(maxPage + 1).fill(0);
  }, [maxPage, search.page]);

  const setPage = (value: number) => {
    setSearch({ ...search, page: `${value}` });
  };

  if (maxPage <= 1) return <div></div>;

  return (
    <div className="post-nav-bar__page">
      {page > 1 && (
        <div
          className="post-nav-bar__button _icon"
          onClick={() => {
            setPage(1);
          }}
        >
          <img src={doubleLeft} alt="" />
        </div>
      )}
      {page > 1 && (
        <div
          className="post-nav-bar__button"
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
              className={`post-nav-bar__button ${
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
          className="post-nav-bar__button"
          onClick={() => {
            setPage(page + 1);
          }}
        >
          ДАЛЕЕ
        </div>
      )}
      {page < maxPage && (
        <div
          className="post-nav-bar__button _icon"
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
