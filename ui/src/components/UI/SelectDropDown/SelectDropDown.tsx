import "./SelectDropDown.scss";
import arrowDown from "../../../assets/media/down.png";
import { CSSTransition } from "react-transition-group";
import { ItemSelectRender } from "../SelectDropDown/ItemSelectRender";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector } from "../../../hooks/redux";

interface ISelectDropDownProps {
  error?: string;
  forbiddenValue?: string[];
  value: string;
  items: IItemSelect[];
  setValue: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
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
  error,
  title,
  setTitle,
  forbiddenValue,
}) => {
  const { userInfo } = useAppSelector((state) => state.user);
  /* Переключение открывающегося меню */
  const [isVisibleSubMenu, setIsVisibleSubMenu] = useState(false);
  const toggleVisible = () => {
    const visible = isVisibleSubMenu ? false : true;
    setIsVisibleSubMenu(visible);
  };
  /* Обработка массива */
  const conditionToAccess = (item: IItemSelect) => {
    if (forbiddenValue && forbiddenValue.includes(item.id)) return false;
    if (
      item.access ||
      (userInfo && (userInfo.role === "admin" || userInfo.role === "moder"))
    )
      return true;
    return false;
  };
  const recursiveGetItem = (
    array: IItemSelect[],
    preferLevel: number,
    parentID: string | null = null
  ) => {
    let newArray: IRenderItemArray[] = [];
    const level = preferLevel + 1;

    for (const item of array) {
      const access = conditionToAccess(item);
      const newItem: IRenderItemArray = {
        id: item.id,
        parent: parentID,
        open: false,
        access,
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
  const titleList = useMemo(() => {
    const list = [];
    for (const item of renderArray) {
      list.push(item.title);
    }
    return list;
  }, [renderArray]);
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
    if (index === -1 || !renderArray?.[index]?.access) {
      setValue("");
      return;
    }

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
    if (id === "") return;
    const index = renderArray.findIndex((item) => item.id == id);
    if (index === -1) return;
    const parent = renderArray[index].parent;
    if (parent !== null) openSelectedItem(parent);
    openVisibleChildren(id);
  };

  useEffect(() => {
    if (renderArray.length > 0 && !titleList.includes(title) && value !== "") {
      setInfoByID(value);
      openSelectedItem(value);
    }
  }, [renderArray]);
  useEffect(() => {
    if (renderArray.length > 0) setInfoByID(value);
  }, [value]);

  return (
    <div className="select-drop-down">
      <div className="select-drop-down__info" onClick={toggleVisible}>
        <p
          className={`select-drop-down__caption ${
            title === "" ? "" : "_selected"
          }`}
        >
          {title !== "" && title}
          {title === "" && error && error.length === 0 && "Выбрать"}
          {title === "" && error && error.length > 0 && error}
          {title === "" && !error && "Главная"}
        </p>
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
