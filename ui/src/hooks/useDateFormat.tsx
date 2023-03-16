import { useMemo } from "react";
import { getDiffInHours } from "../helpers/getDiffInHours";

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
      const hoursDiff = getDiffInHours(dateString);
      if (hoursDiff === 0) {
        formatted = findMinutesAgo(date, now);
      } else {
        formatted = findHoursAgo(hoursDiff);
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

function findHoursAgo(diff: number) {
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
  let day: string | number = date.getDate();
  const month = date.getMonth();
  const monthString = monthList[month];
  const year = date.getFullYear();
  if (day < 10) day = `0${day}`;

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
  let hours: string | number = date.getHours();
  let minutes: string | number = date.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  if (hours < 10) hours = `0${hours}`;

  return `${weeklyDayString} в ${hours}:${minutes}`;
}
