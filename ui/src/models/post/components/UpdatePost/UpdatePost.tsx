import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdatePost.scss";
import { useEffect, useState } from "react";
import { updatePost } from "../../../../store/reducers/post/postActionCreator";
import { usePopup } from "../../../../hooks/usePopup";
import { useConfirm } from "../../../../hooks/useConfirm";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import { useValidation } from "../../../../hooks/useValidation";
import {
  postValidation,
  postValidationField,
} from "../../../../models/post/validation/postValidation";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import useFetching from "../../../../hooks/useFetching";
import { axiosInstanceToken } from "../../../../helpers/axiosInstanceToken";
import { Loader } from "../../../../components/Loader/Loader";
import { SelectTopic } from "../../../../components/SelectTopic/SelectTopic";

interface IUpdateForm {
  [key: string]: string;
  title: string;
  topicID: string;
}
interface ICurrentPost {
  id: string;
  title: string;
  verified: boolean;
  authorID: string;
  authorNickName: string;
  topicID: string;
  topicTitle: string;
  date: string;
}

export const UpdatePost: React.FC = () => {
  const navigate = useNavigate();
  const title = "Редактирование темы";
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.user);
  const { postID } = useParams();
  const { isLoading, response, updated } = useAppSelector(
    (state) => state.post
  );
  /* Создание информационных окон, проверка на доступ к посту */
  const { popup, setPopup } = usePopup();
  const { confirm, checkConfirm } = useConfirm();
  const [currentPost, setCurrentPost] = useState<ICurrentPost | null>(null);
  const getPostByID = async () => {
    const response = await axiosInstanceToken.get<ICurrentPost>(
      `/api/post/access/${postID}`
    );
    setCurrentPost(response.data);
    setForm({ title: response.data.title, topicID: response.data.topicID });
  };
  const { fetching, isLoading: isLoadingAccess } = useFetching(
    getPostByID,
    setPopup,
    title,
    () => {
      navigate("/");
    }
  );
  useEffect(() => {
    if (!postID)
      setPopup(title, "Доступ к редактированию темы не обнаружен!", () => {
        navigate("/");
      });
    else fetching();
  }, []);
  /* Инициализация формы и активация валидации */
  const [form, setForm] = useState<IUpdateForm>({ title: "", topicID: "" });
  const [topicTitle, setTopicTitle] = useState("");
  const setTitle = (v: string) => {
    setForm({ ...form, title: v });
  };
  const setTopicID = (v: string) => {
    setForm({ ...form, topicID: v });
  };
  const [errorForm, setErrorForm] = useState<IUpdateForm>({
    title: "",
    topicID: "",
  });
  useValidation(form, errorForm, setErrorForm, postValidationField);
  const checkForm = () => {
    if (isLoading) return;
    postValidation(form, errorForm, setErrorForm);
    for (const field in errorForm) {
      if (errorForm[field].length > 0) return;
    }
    checkConfirm(title, "Вы уверены, что хотите обновить тему?", sendForm);
  };
  /* Отправка запроса на обновление и обработка ответа  */
  const sendForm = () => {
    if (postID)
      dispatch(
        updatePost({ postID, title: form.title, topicID: form.topicID })
      );
  };
  useEffectOnlyUpdate(() => {
    if (response.length > 0) {
      if (updated)
        setPopup(title, response, () => {
          navigate(`/topic/${form.topicID}`);
        });
      else
        setPopup(title, response, () => {
          navigate(`/topic/${currentPost?.topicID}`);
        });
    }
  }, [response]);

  return (
    <div className="update-post">
      {confirm}
      {popup}
      {isLoadingAccess && <Loader />}
      {!currentPost && (
        <div className="update-post__header">Изменить название темы</div>
      )}
      {currentPost && (
        <div className="update-post__header">
          Изменить информацию темы {currentPost.title} в топике{" "}
          {currentPost.topicTitle}
        </div>
      )}

      <div className="update-post__content">
        {userInfo &&
          (userInfo.role === "admin" || userInfo.role === "moder") && (
            <div className="add-post__select-wrapper">
              <SelectTopic
                value={form.topicID}
                setValue={setTopicID}
                title={topicTitle}
                setTitle={setTopicTitle}
                error={form.topicID}
              />
            </div>
          )}
        <InputTooltip
          type="text"
          title="Заголовок"
          value={form.title}
          setValue={setTitle}
          error={errorForm.title}
        />

        <div className="update-post__button-wrapper">
          <BlackButton onClick={checkForm}> Обновить </BlackButton>
        </div>
      </div>
    </div>
  );
};
