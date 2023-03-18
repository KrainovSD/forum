import { SelectTopic } from "../../../../components/SelectTopic/SelectTopic";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { CheckBox } from "../../../../components/UI/CheckBox/CheckBox";
import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useConfirm } from "../../../../hooks/useConfirm";
import { usePopup } from "../../../../hooks/usePopup";
import { useValidation } from "../../../../hooks/useValidation";
import {
  ITopicErrorForm,
  topicValidation,
  topicValidationField,
} from "../../../../models/topic/validation/topicValidation";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./UpdateTopic.scss";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { updateTopic } from "../../../../store/reducers/topic/topicActionCreator";
import useFetching from "../../../../hooks/useFetching";
import { axiosInstance } from "../../../../helpers/axiosInstance";
import { Loader } from "../../../../components/Loader/Loader";

interface ITopicChildrenInfo {
  topic: ITopic;
  children: string[];
}

interface ITopic {
  id: string;
  title: string;
  access: boolean;
  parentID: string;
  parentTitle: string;
}

export const UpdateTopic: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { popup, setPopup } = usePopup();
  const { checkConfirm, confirm } = useConfirm();
  const { response, isLoading } = useAppSelector((state) => state.topic);

  const { topicID } = useParams();
  const [topicInfo, setTopicInfo] = useState<ITopic>({
    access: false,
    parentID: "",
    parentTitle: "",
    title: "",
    id: "",
  });
  const [forbiddenValue, setForbiddenValue] = useState<string[]>([]);
  const getTopicInfoAndChildrenTopic = async () => {
    const response = await axiosInstance.get<ITopicChildrenInfo>(
      `/api/topic/allChildren/${topicID}`
    );
    const topicInfo = response.data.topic;
    setForbiddenValue([...response.data.children]);
    setTopicInfo({
      id: topicInfo.id,
      parentID: topicInfo.parentID,
      parentTitle: topicInfo.parentTitle,
      access: topicInfo.access,
      title: topicInfo.title,
    });
    setForm({
      topicID: topicInfo.parentID,
      access: topicInfo.access,
      title: topicInfo.title,
    });
  };
  const { fetching, isLoading: isLoadingTopicInfo } = useFetching(
    getTopicInfoAndChildrenTopic,
    setPopup,
    "Информация о топике",
    () => {
      navigate("/");
    }
  );
  useEffect(() => {
    fetching();
  }, []);

  const [form, setForm] = useState({
    title: "",
    topicID: "",
    access: false,
  });
  const [errorForm, setErrorForm] = useState<ITopicErrorForm>({
    title: "",
  });
  const setTitle = (v: string) => {
    setForm({ ...form, title: v });
  };
  const setTopicID = (v: string) => {
    setForm({ ...form, topicID: v });
  };
  const setAccess = () => {
    const value = form.access ? false : true;
    setForm({ ...form, access: value });
  };
  useValidation(form, errorForm, setErrorForm, topicValidationField);

  const [parentTitle, setParenTitle] = useState("");
  useEffect(() => {
    if (form.topicID === "") setParenTitle("Главня страница");
  }, [form.topicID]);

  const sendForm = () => {
    if (topicID)
      dispatch(
        updateTopic({
          access: form.access,
          parentID: form.topicID.length > 0 ? form.topicID : "null",
          title: form.title,
          topicID: topicID,
        })
      );
  };
  const checkForm = () => {
    if (isLoading) return;
    topicValidation(form, errorForm, setErrorForm);
    for (const field in errorForm) {
      if (errorForm[field].length > 0) return;
    }
    checkConfirm(
      "Обновление топика",
      "Вы уверены, что хотите обновить информацию о топике?",
      sendForm
    );
  };

  const showResponse = () => {
    if (response.length > 0)
      setPopup("Создание топика", response, () => {
        navigate(`${form.topicID ? `/topic/${form.topicID}` : `/`}`);
      });
  };
  useEffectOnlyUpdate(showResponse, [response]);

  return (
    <div className="add-post">
      {isLoadingTopicInfo && <Loader />}
      {confirm}
      {popup}
      <div className="update-topic__header">
        Обновить топик {topicInfo.title} внутри {topicInfo.parentTitle}
      </div>
      <div className="update-topic__content">
        <div className="update-topic__select-wrapper">
          <SelectTopic
            value={form.topicID}
            setValue={setTopicID}
            title={parentTitle}
            setTitle={setParenTitle}
            forbiddenValue={forbiddenValue}
          />
        </div>

        <CheckBox
          title="Разрешить доступ к созданию постов"
          value={form.access}
          setValue={setAccess}
        />

        <InputTooltip
          type="text"
          title="Заголовок"
          value={form.title}
          setValue={setTitle}
          error={errorForm.title}
        />

        <div className="update-topic__button-wrapper">
          <BlackButton onClick={checkForm}> Обновить </BlackButton>
        </div>
      </div>
    </div>
  );
};
