import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddPost.scss";
import { CommentEditor } from "../../../../models/comment/components/CommentEditor/CommentEditor";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import {
  postValidation,
  postValidationField,
} from "../../../../models/post/validation/postValidation";
import { useValidation } from "../../../../hooks/useValidation";
import { SelectTopic } from "../../../../components/SelectTopic/SelectTopic";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { createPost } from "../../../../store/reducers/post/postActionCreator";
import { useConfirm } from "../../../../hooks/useConfirm";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";

interface IPostForm {
  [key: string]: string;
  title: string;
  comment: string;
  topicID: string;
}

export const AddPost: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { topicID } = useParams();
  const { response, isLoading } = useAppSelector((state) => state.post);

  const [postForm, setPostForm] = useState<IPostForm>({
    title: "",
    comment: "",
    topicID: topicID ? topicID : "",
  });
  const [errorPostForm, setErrorPostForm] = useState<IPostForm>({
    title: "",
    comment: "",
    topicID: "",
  });
  const setTitle = (v: string) => {
    setPostForm({ ...postForm, title: v });
  };
  const setComment = (v: string) => {
    setPostForm({ ...postForm, comment: v });
  };
  const setTopicID = (v: string) => {
    setPostForm({ ...postForm, topicID: v });
  };
  const [topicTitle, setTopicTitle] = useState("");

  useValidation(postForm, errorPostForm, setErrorPostForm, postValidationField);

  const sendForm = () => {
    dispatch(
      createPost({
        title: postForm.title,
        body: postForm.comment,
        topicID: postForm.topicID,
      })
    );
  };
  const { checkConfirm, confirm } = useConfirm(sendForm);

  const checkForm = () => {
    if (isLoading) return;
    postValidation(postForm, errorPostForm, setErrorPostForm);
    for (let field in errorPostForm) {
      const fieldData = errorPostForm[field];
      if (fieldData.length > 0) return;
    }
    checkConfirm(
      "Создание новой темы",
      `Вы уверены, что хотите создать новую тему в топике ${topicTitle}?`
    );
  };

  const { popup, setPopup } = usePopup(() => {
    navigate(`/topic/${postForm.topicID}`);
  });
  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Создание новой темы", response);
  }, [response]);

  useEffect(() => {
    if (postForm.topicID !== topicID) {
      navigate(`/create/post/${postForm.topicID}`, { replace: true });
    }
  }, [postForm.topicID]);

  return (
    <div className="add-post">
      {confirm}
      {popup}
      <div className="add-post__header">Создать новую тему</div>
      <div className="add-post__content">
        <div className="add-post__select-wrapper">
          <SelectTopic
            value={postForm.topicID}
            setValue={setTopicID}
            title={topicTitle}
            setTitle={setTopicTitle}
            error={errorPostForm.topicID}
          />
        </div>

        <InputTooltip
          type="text"
          title="Заголовок"
          value={postForm.title}
          setValue={setTitle}
          error={errorPostForm.title}
        />

        <p className="add-post__caption">Комментарий</p>
        <div className="add-post__editor-wrapper">
          <CommentEditor value={postForm.comment} setValue={setComment} />
          <div className="add-post__editor-footer"></div>
        </div>

        <div className="add-post__button-wrapper">
          <BlackButton onClick={checkForm}> Создать </BlackButton>
        </div>
      </div>
    </div>
  );
};
