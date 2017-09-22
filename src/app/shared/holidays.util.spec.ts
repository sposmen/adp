import { HolidaysUtil } from './holidays.util';

describe('holidays.util', () => {

  let holidaysUtil: HolidaysUtil;

  beforeEach(() => {
    holidaysUtil = new HolidaysUtil();
  });

  it('holidays AR', () => {
    holidaysUtil.init('AR');
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 19, 12, 0, 0))).toBe(false);
    expect(holidaysUtil.isHoliday(new Date(2017, 1, 27, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 8, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 25, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 1, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 2, 12, 0, 0))).toBe(false);
  });

  it('holidays CO', () => {
    holidaysUtil.init('CO');
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 19, 12, 0, 0))).toBe(false);
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 20, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 8, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 25, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 1, 12, 0, 0))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 2, 12, 0, 0))).toBe(false);
  });

  it('weekdays', () => {
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 14, 12, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 15, 12, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 16, 12, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 20, 12, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 8, 12, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 25, 12, 0, 0))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 30, 12, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 31, 12, 0, 0))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2018, 0, 1, 12, 0, 0))).toBe(true);
  });

});
