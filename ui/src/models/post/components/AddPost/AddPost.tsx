import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./AddPost.scss";
import { CommentEditor } from "../../../../models/comment/components/CommentEditor/CommentEditor";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import {
  postValidation,
  postValidationField,
} from "../../../../models/post/validation/postValidation";
import { useValidation } from "../../../../hooks/useValidation";
import { SelectTopic } from "../../../../components/UI/SelectTopic/SelectTopic";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { createPost } from "../../../../store/reducers/post/postActionCreator";
import { useConfirm } from "../../../../hooks/useConfirm";

interface IPostForm {
  [key: string]: string;
  title: string;
  comment: string;
  topicID: string;
}

export const AddPost: React.FC = () => {
  const dispatch = useAppDispatch();
  const { topicID } = useParams();
  const { isLoading } = useAppSelector((state) => state.post);
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
  useValidation(postForm, errorPostForm, setErrorPostForm, postValidationField);

  const addPost = () => {
    dispatch(
      createPost({
        title: postForm.title,
        comment: postForm.comment,
        topicID: postForm.topicID,
      })
    );
  };
  const { checkConfirm, confirm } = useConfirm(addPost);

  const sendForm = () => {
    if (isLoading) return;
    postValidation(postForm, errorPostForm, setErrorPostForm);
    for (let field in errorPostForm) {
      const fieldData = errorPostForm[field];
      if (fieldData.length > 0) return;
    }
    checkConfirm(
      "Создание новой темы",
      "Вы уверены, что хотите создать новую тему?"
    );
  };

  return (
    <div className="add-post">
      {confirm}
      <div className="add-post__header">Создать новую тему</div>
      <div className="add-post__content">
        <div className="add-post__select-wrapper">
          <SelectTopic
            value={postForm.topicID}
            setValue={setTopicID}
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
          <BlackButton onClick={sendForm}> Создать </BlackButton>
        </div>
      </div>
    </div>
  );
};
