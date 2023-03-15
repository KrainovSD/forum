import "./SelectDropDown.scss";
import arrowDown from "../../../assets/media/down.png";
import { CSSTransition } from "react-transition-group";
import { ItemSelectRender } from "../SelectDropDown/ItemSelectRender";
import { usePopup } from "../../../hooks/usePopup";
import { useState, useEffect } from "react";

interface ISelectDropDownProps {
  value: string;
  items: IItemSelect[];
  setValue: (v: string) => void;
}
export interface IItemSelect {
  id: string;
  title: string;
  access: boolean;
  children: IItemSelect[];
}

export interface IRenderItemArray {
  id: string;
  parent: string | null;
  open: boolean;
  title: string;
  access: boolean;
  children: boolean;
  level: number;
}

export const SelectDropDown: React.FC<ISelectDropDownProps> = ({
  value,
  items,
  setValue,
}) => {
  const [title, setTitle] = useState("");
  /* Переключение открывающегося меню */
  const [isVisibleSubMenu, setIsVisibleSubMenu] = useState(false);
  const toggleVisible = () => {
    if (items.length === 0)
      setPopup("Список топиков", "Доступные топики не найдены!");
    const visible = isVisibleSubMenu ? false : true;
    setIsVisibleSubMenu(visible);
  };
  const { popup, setPopup } = usePopup(() => {});
  /* Обработка массива */
  const recursiveGetItem = (
    array: IItemSelect[],
    preferLevel: number,
    parentID: string | null = null
  ) => {
    let newArray: IRenderItemArray[] = [];
    const level = preferLevel + 1;

    for (const item of array) {
      const newItem: IRenderItemArray = {
        id: item.id,
        parent: parentID,
        open: false,
        access: item.access,
        level,
        title: item.title,
        children: item.children.length > 0,
      };
      if (item.children.length > 0)
        newArray = [
          ...newArray,
          newItem,
          ...recursiveGetItem(item.children, level, item.id),
        ];
      else newArray.push(newItem);
    }
    return newArray;
  };
  const [renderArray, setRenderArray] = useState<IRenderItemArray[]>([]);
  useEffect(() => {
    if (items.length > 0) {
      setRenderArray(recursiveGetItem(items, 0));
    }
  }, [items]);

  /* Обработка изменений, установка изначальных значений */
  const setInfoByID = (id: string) => {
    if (id === "") {
      setTitle("");
      return;
    }
    const index = renderArray.findIndex((item) => item.id == id);
    if (index === -1) setValue("");
    const title = renderArray[index].title;
    setTitle(title);
  };
  const openVisibleChildren = (id: string) => {
    const index = renderArray.findIndex((item) => item.id === id);
    if (index === -1) return;
    const oldArray = renderArray;
    oldArray[index].open = true;
    setRenderArray([...oldArray]);
  };
  const openSelectedItem = (id: string) => {
    const index = renderArray.findIndex((item) => item.id == id);
    if (index === -1) return;
    const parent = renderArray[index].parent;
    if (parent !== null) openSelectedItem(parent);
    openVisibleChildren(id);
  };

  useEffect(() => {
    if (renderArray.length > 0 && title === "" && value !== "") {
      setInfoByID(value);
      openSelectedItem(value);
    }
  }, [renderArray]);
  useEffect(() => {
    if (renderArray.length > 0) setInfoByID(value);
  }, [value]);

  return (
    <div className="select-drop-down">
      {popup}
      <div className="select-drop-down__info" onClick={toggleVisible}>
        <p
          className={`select-drop-down__caption ${
            title === "" ? "" : "_selected"
          }`}
        >{`${title === "" ? "Выбрать" : title}`}</p>
        <img src={arrowDown} alt="" />
      </div>
      {renderArray.length > 0 && (
        <CSSTransition
          in={isVisibleSubMenu}
          timeout={300}
          classNames="appear-anim"
          unmountOnExit
        >
          <div className="select-drop-down__sub-menu">
            <ItemSelectRender
              renderArray={renderArray}
              setRenderArray={setRenderArray}
              value={value}
              setValue={setValue}
              setTitle={setTitle}
            />
          </div>
        </CSSTransition>
      )}
    </div>
  );
};
