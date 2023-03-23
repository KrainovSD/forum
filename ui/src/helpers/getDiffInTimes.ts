export const getDiffInHours = (date: string) => {
  const hours = 1000 * 60 * 60;
  const now = Date.now();
  const dateFirst = Date.parse(date);
  const diff = now - dateFirst;

  return Math.floor(diff / hours);
};
export const getDiffInDays = (date: string) => {
  const day = 1000 * 60 * 60 * 24;
  const now = Date.now();
  const dateFirst = Date.parse(date);
  const diff = now - dateFirst;

  return Math.floor(diff / day);
};
export const getDiffInMintues = (date: string) => {
  const minute = 1000 * 60;
  const now = Date.now();
  const dateFirst = Date.parse(date);
  const diff = now - dateFirst;

  return Math.floor(diff / minute);
};
