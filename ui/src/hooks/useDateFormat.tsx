import {
  getDiffInDays,
  getDiffInMintues,
  getDiffInHours,
} from "../helpers/getDiffInTimes";
import { useMemo } from "react";

export const useDateFormat = (dateString: string) => {
  const dateFormatted: string = useMemo(() => {
    let formatted: string;

    const dayDiff = getDiffInDays(dateString);
    if (dayDiff >= 1 && dayDiff < 7) {
      formatted = findWeeklyDate(dateString);
    } else if (dayDiff < 1) {
      const hoursDiff = getDiffInHours(dateString);
      if (hoursDiff === 0) {
        formatted = findMinutesAgo(dateString);
      } else {
        formatted = findHoursAgo(hoursDiff);
      }
    } else {
      formatted = findFullDate(dateString);
    }

    return formatted;
  }, [dateString]);
  return dateFormatted;
};

function findMinutesAgo(date: string) {
  let diff = getDiffInMintues(date);
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
function findFullDate(date: string) {
  const dateObj = new Date(date);
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
  let day: string | number = dateObj.getDate();
  const month = dateObj.getMonth();
  const monthString = monthList[month];
  const year = dateObj.getFullYear();
  if (day < 10) day = `0${day}`;

  return `${day} ${monthString} ${year}`;
}
function findWeeklyDate(date: string) {
  const dateObj = new Date(date);
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const weeklyDay = dateObj.getDay();
  const weeklyDayString = days[weeklyDay];
  let hours: string | number = dateObj.getHours();
  let minutes: string | number = dateObj.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  if (hours < 10) hours = `0${hours}`;

  return `${weeklyDayString} в ${hours}:${minutes}`;
}
