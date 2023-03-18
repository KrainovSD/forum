import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useConfirm } from "../../../../hooks/useConfirm";
import { usePopup } from "../../../../hooks/usePopup";
import { SelectTopic } from "../../../../components/SelectTopic/SelectTopic";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import { useState, useEffect } from "react";
import "./AddTopic.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useValidation } from "../../../../hooks/useValidation";
import {
  ITopicErrorForm,
  topicValidation,
  topicValidationField,
} from "../../../../models/topic/validation/topicValidation";
import { createTopic } from "../../../../store/reducers/topic/topicActionCreator";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { CheckBox } from "../../../../components/UI/CheckBox/CheckBox";
export const AddTopic: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { response, isLoading } = useAppSelector((state) => state.topic);
  const { topicID } = useParams();
  const [form, setForm] = useState({
    title: "",
    topicID: topicID ? topicID : "",
    access: false,
  });
  const [errorForm, setErrorForm] = useState<ITopicErrorForm>({ title: "" });
  const [parentTitle, setParenTitle] = useState("");
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

  const sendForm = () => {
    dispatch(
      createTopic({
        access: form.access,
        parentID: form.topicID.length > 0 ? form.topicID : "null",
        title: form.title,
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
      "Создание топика",
      `Вы уверены, что хотите создать топик внутри ${parentTitle}?`,
      sendForm
    );
  };

  const { confirm, checkConfirm } = useConfirm();
  const { popup, setPopup } = usePopup();
  const showResponse = () => {
    if (response.length > 0)
      setPopup("Создание топика", response, () => {
        navigate(`${topicID ? `/topic/${topicID}` : `/`}`);
      });
  };
  useEffectOnlyUpdate(showResponse, [response]);
  useEffect(() => {
    if (form.topicID === "") setParenTitle("Главная страница");
    if (form.topicID !== topicID) {
      navigate(`/create/topic/${form.topicID}`, { replace: true });
    }
  }, [form.topicID]);

  return (
    <div className="add-post">
      {confirm}
      {popup}
      <div className="add-topic__header">Создать новый топик</div>
      <div className="add-topic__content">
        <div className="add-topic__select-wrapper">
          <SelectTopic
            value={form.topicID}
            setValue={setTopicID}
            title={parentTitle}
            setTitle={setParenTitle}
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

        <div className="add-topic__button-wrapper">
          <BlackButton onClick={checkForm}> Создать </BlackButton>
        </div>
      </div>
    </div>
  );
};
