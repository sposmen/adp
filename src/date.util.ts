export function checkIsWeekend(date: Date) {
  const dayOfWeek = date.getUTCDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}
