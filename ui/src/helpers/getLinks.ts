export const getUserLink = (userID: string) => {
  return `/profile/info/${userID}`;
};
export const getUserContentLink = (userID: string, path: string) => {
  if (!path) path = "comments";
  return `/profile/content/${path}/${userID}`;
};

export const getTopicLink = (topicID: string) => {
  return `/topic/${topicID}`;
};

export const getPostLink = (postID: string) => {
  return `/post/${postID}`;
};

export const getUpdatePostLink = (postID: string) => {
  return `/update/post/${postID}`;
};

export const getUpdateTopicLink = (topicID: string) => {
  return `/update/topic/${topicID}`;
};

export const getCreatePostLink = (topicID?: string) => {
  if (topicID) return `/create/post/${topicID}`;
  return `/create/post`;
};

export const getCreateTopicLink = (topicID?: string) => {
  if (topicID) return `/create/topic/${topicID}`;
  return `/create/post`;
};

export const getAdminPanelCommentsLink = () => {
  return `/admin-panel/comments`;
};

export const getAdminPanelPostsLink = () => {
  return `/admin-panel/posts`;
};

export const getSettingLink = (option: string) => {
  return `/setting/${option}`;
};
