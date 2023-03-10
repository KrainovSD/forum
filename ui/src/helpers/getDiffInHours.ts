export const getDiffInHours = (date: string) => {
  const hours = 1000 * 60 * 60;
  const now = Math.floor(Date.now() / hours);
  const dateFirst = Math.floor(Date.parse(date) / hours);

  return now - dateFirst;
};
