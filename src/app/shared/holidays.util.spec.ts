import { HolidaysUtil } from './holidays.util';

describe('holidays.util', () => {

  let holidaysUtil: HolidaysUtil;

  beforeEach(() => {
    holidaysUtil = new HolidaysUtil();
  });

  it('holidays AR', () => {
    holidaysUtil.init('AR');
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 19, 0, 0, 0))).toBe(false);
    expect(holidaysUtil.isHoliday(new Date(2017, 1, 27, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 8, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 25, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 1, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 2, 0, 0, 0))).toBe(false);
  });

  it('holidays CO', () => {
    holidaysUtil.init('CO');
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 19, 0, 0, 0))).toBe(false);
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 20, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 8, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 25, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 1, 0, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 2, 0, 0, 0))).toBe(false);
  });

  it('weekdays', () => {
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 14, 0, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 15, 0, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 16, 0, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 20, 0, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 8, 0, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 25, 0, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 30, 0, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 31, 0, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2018, 0, 1, 0, 0, 0))).toBe(true);
  });

});
