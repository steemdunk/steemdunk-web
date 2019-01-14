export function dateToString(date: Date, withTime = true) {
  function formatNumber(num) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  };

  var d = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  var t = withTime ? ' ' + date.getHours() + ':'
            + formatNumber(date.getMinutes()) + ':'
            + formatNumber(date.getSeconds()) : '';
  return d + t;
}
