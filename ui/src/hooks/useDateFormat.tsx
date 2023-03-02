import { useMemo } from "react";

export const useDateFormat = (dateString: string) => {
  const dateFormatted: string = useMemo(() => {
    let formatted: string;

    const date = new Date(dateString);
    const now = new Date();
    const dayDiff =
      convertToDaysFromMilliseconds(now) - convertToDaysFromMilliseconds(date);
    if (dayDiff >= 1 && dayDiff < 7) {
      formatted = findWeeklyDate(date);
    } else if (dayDiff < 1) {
      const hours = date.getHours();
      const nowHours = now.getHours();
      const hoursDiff = nowHours - hours;
      if (hoursDiff === 0) {
        formatted = findMinutesAgo(date, now);
      } else {
        formatted = findHoursAgo(date, now);
      }
    } else {
      formatted = findFullDate(date);
    }

    return formatted;
  }, [dateString]);
  return dateFormatted;
};

function convertToDaysFromMilliseconds(date: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return date.getTime() / msPerDay;
}

function findMinutesAgo(date: Date, now: Date) {
  const minutes = date.getMinutes();
  const nowMinutes = now.getMinutes();
  let diff = nowMinutes - minutes;
  let result = `${diff}`;
  if (diff > 20) diff = diff % 10;

  if (diff === 1) result = `${result} минуту назад`;
  else if (diff >= 2 && diff <= 4) result = `${result} минуты назад`;
  else result = `${result} минут назад`;

  return result;
}

function findHoursAgo(date: Date, now: Date) {
  const hours = date.getHours();
  const nowHours = now.getHours();
  let diff = nowHours - hours;
  let result = `${diff}`;
  if (diff > 20) diff = diff % 10;

  if (diff === 1) result = `${result} час назад`;
  else if (diff >= 2 && diff <= 4) result = `${result} часа назад`;
  else result = `${result} часов назад`;

  return result;
}
function findFullDate(date: Date) {
  const monthList = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const day = date.getDate();
  const month = date.getMonth();
  const monthString = monthList[month];
  const year = date.getFullYear();

  return `${day} ${monthString} ${year}`;
}
function findWeeklyDate(date: Date) {
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const weeklyDay = date.getDay();
  const weeklyDayString = days[weeklyDay];
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${weeklyDayString} в ${hours}:${minutes}`;
}
