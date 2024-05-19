import { format, formatDistanceToNowStrict, isSameDay } from 'date-fns';

import { ru } from 'date-fns/locale/ru';

export const formatCommentCreateDate = (date: Date | string) => {
  const dateCopy = new Date(date);
  if (isSameDay(dateCopy, new Date())) {
    const formattedDistance = formatDistanceToNowStrict(dateCopy, {
      locale: ru,
    });
    return `${formattedDistance} назад`;
  }

  return format(new Date(dateCopy), 'dd.MM.yyyy, HH:mm:ss');
};
