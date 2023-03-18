import { useAppSelector } from "../../../hooks/redux";
import { useEffect } from "react";
import arrowRight from "../../../assets/media/arrow-right-black.png";
import { IRenderItemArray } from "./SelectDropDown";
interface IItemSelectRenderProps {
  renderArray: IRenderItemArray[];
  setRenderArray: (array: IRenderItemArray[]) => void;
  value: string;
  setValue: (v: string) => void;
  setTitle: (v: string) => void;
}

export const ItemSelectRender: React.FC<IItemSelectRenderProps> = ({
  renderArray,
  setRenderArray,
  value,
  setValue,
  setTitle,
}) => {
  const calcPaddingChildren = (level: number) => {
    const px = (level - 1) * 15;
    return `${px}px`;
  };
  const isVisibleItem = (parentID: string | null): boolean => {
    if (parentID === null) return true;
    const parent = renderArray.filter((item) => item.id === parentID);
    if (!parent[0].open) return false;
    const olderParent = parent[0].parent;
    return isVisibleItem(olderParent);
  };
  const toggleVisibleChildren = (id: string) => {
    const index = renderArray.findIndex((item) => item.id === id);
    if (index === -1) return;
    const newValue = renderArray[index].open ? false : true;
    const oldArray = renderArray;
    oldArray[index].open = newValue;
    setRenderArray([...oldArray]);
  };

  return (
    <div>
      {renderArray.map((item, index) => (
        <div key={item.id}>
          {isVisibleItem(item.parent) && (
            <div
              className={`select-drop-down__sub-item ${
                index === renderArray.length - 1 ? "_last" : ""
              }`}
              style={{ paddingLeft: calcPaddingChildren(item.level) }}
            >
              <div
                className="select-drop-down__sub-item-content"
                onClick={() => {
                  toggleVisibleChildren(item.id);
                }}
              >
                {item.children && <img src={arrowRight} alt="" />}
                <p
                  className={`select-drop-down__sub-title ${
                    value == item.id ? "_active" : ""
                  }`}
                >
                  {item.title}
                </p>
              </div>
              {item.access && (
                <span
                  className="_select"
                  onClick={() => {
                    value == item.id ? setValue("") : setValue(`${item.id}`);
                  }}
                >
                  Выбрать
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
