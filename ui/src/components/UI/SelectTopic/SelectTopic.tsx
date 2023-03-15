import "./SelectTopic.scss";

import { useState, useEffect } from "react";
import useFetching from "../../../hooks/useFetching";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { IItemSelect, SelectDropDown } from "../SelectDropDown/SelectDropDown";

interface ISelectTopicProps {
  value: string;
  setValue: (v: string) => void;
  error: string;
}

export const SelectTopic: React.FC<ISelectTopicProps> = ({
  value,
  setValue,
  error,
}) => {
  const [items, setItems] = useState<IItemSelect[]>([]);
  const [fetching, isLoading, errorGetPosts, errorStatus] = useFetching(
    async () => {
      const response = await axiosInstance.get<IItemSelect[]>(
        "/api/topic/access"
      );
      setItems(response.data);
    }
  );
  useEffect(() => {
    fetching();
  }, []);

  return <SelectDropDown value={value} setValue={setValue} items={items} />;
};
