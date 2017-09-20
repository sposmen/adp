import * as Holidays from 'date-holidays';

export const holidaysUtil = new Holidays();

holidaysUtil.isWeekday = function (date: Date) {
  const dayOfWeek = date.getUTCDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
};

