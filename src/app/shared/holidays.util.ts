import * as Holidays from 'date-holidays';

export class HolidaysUtil extends Holidays {
  isWeekday(date: Date) {
    const dayOfWeek = date.getUTCDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }
}

export const holidaysUtil = new HolidaysUtil();


