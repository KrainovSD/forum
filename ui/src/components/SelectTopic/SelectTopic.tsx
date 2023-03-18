import "./SelectTopic.scss";

import { useState, useEffect } from "react";
import useFetching from "../../hooks/useFetching";
import {
  IItemSelect,
  SelectDropDown,
} from "../UI/SelectDropDown/SelectDropDown";
import { usePopup } from "../../hooks/usePopup";
import { useNavigate } from "react-router-dom";
import { axiosInstanceToken } from "../../helpers/axiosInstanceToken";
import { Loader } from "../../components/Loader/Loader";

interface ISelectTopicProps {
  value: string;
  setValue: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  forbiddenValue?: string[];
  error?: string;
}

export const SelectTopic: React.FC<ISelectTopicProps> = ({
  value,
  setValue,
  title,
  setTitle,
  error,
  forbiddenValue,
}) => {
  const navigator = useNavigate();
  const [items, setItems] = useState<IItemSelect[]>([]);

  const { popup, setPopup } = usePopup(() => {
    navigator("/");
  });
  const getTopicList = async () => {
    const response = await axiosInstanceToken.get<IItemSelect[]>(
      "/api/topic/access"
    );
    setItems(response.data);
  };
  const { fetching, isLoading } = useFetching(
    getTopicList,
    setPopup,
    "Список топиков"
  );
  useEffect(() => {
    fetching();
  }, []);
  return (
    <div>
      {popup}
      {isLoading && <Loader />}
      <SelectDropDown
        value={value}
        setValue={setValue}
        title={title}
        setTitle={setTitle}
        items={items}
        error={error}
        forbiddenValue={forbiddenValue}
      />
    </div>
  );
};
