import { HolidaysUtil } from './holidays.util';

describe('holidays.util', () => {

  let holidaysUtil: HolidaysUtil;

  beforeEach(() => {
    holidaysUtil = new HolidaysUtil();
  });

  it('holidays AR', () => {
    holidaysUtil.init('AR');
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 19))).toBe(false);
    expect(holidaysUtil.isHoliday(new Date(2017, 1, 27))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 8))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 25))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 1))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 2))).toBe(false);
  });

  it('holidays CO', () => {
    holidaysUtil.init('CO');
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 19))).toBe(false);
    expect(holidaysUtil.isHoliday(new Date(2017, 6, 20))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 8))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2017, 11, 25))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 1))).toBeTruthy();
    expect(holidaysUtil.isHoliday(new Date(2018, 0, 2))).toBe(false);
  });

  it('weekdays', () => {
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 14))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 15))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 16))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 6, 20))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 8))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 25))).toBe(true);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 30))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2017, 11, 31))).toBe(false);
    expect(holidaysUtil.isWeekday(new Date(2018, 0, 1))).toBe(true);
  });

});
