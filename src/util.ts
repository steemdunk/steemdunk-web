function formatNumber(num: number) {
  if (num < 10) {
    return '0' + num;
  }
  return num;
};

export function dateToString(date: Date, withTime = true) {
  const d = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  const t = withTime ? ' ' + date.getHours() + ':'
            + formatNumber(date.getMinutes()) + ':'
            + formatNumber(date.getSeconds()) : '';
  return d + t;
}
