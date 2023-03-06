export const getCountCommentAnswerCaption = (value: string | number) => {
  value = +value;
  if (value > 20) {
    while (value > 20) {
      value = value % 10;
    }
  }
  if (value === 1) return "ответ";
  else if (value >= 2 && value <= 4) return "ответа";
  else return "ответов";
};
export const getViewCountCaption = (value: string | number) => {
  value = +value;

  if (value > 20) {
    while (value > 20) {
      value = value % 10;
    }
  }
  if (value === 1) return "просмотр";
  else if (value >= 2 && value <= 4) return "просмотра";
  else return "просмотров";
};
export const getCountCommentMessageCaption = (value: string | number) => {
  value = +value;
  if (value > 20) {
    while (value > 20) {
      value = value % 10;
    }
  }
  if (value === 1) return "сообщение";
  else if (value >= 2 && value <= 4) return "сообщения";
  else return "сообщений";
};

export const getReputationCaption = (value: string | number) => {
  value = +value;
  if (value > 0 && value < 100) return "Обычный";
  if (value >= 100 && value < 200) return "Хороший";
  if (value >= 200 && value < 300) return "Очень хороший";
  if (value >= 300 && value < 400) return "Отличный";
  if (value >= 400 && value < 500) return "Великолепный";
  if (value >= 500 && value < 600) return "Старейшина";
  if (value >= 600 && value < 1000) return "Гуру";
  if (value >= 1000) return "Ангел";
};
