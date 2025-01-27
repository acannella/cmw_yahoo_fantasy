/**
 *
 * @param {ISO 8601 string} timeString
 * @returns Date object from the timeString minus the timezone offset
 */
const dateWithTimeZoneOffset = function (timeString) {
  const dateFromtimeString = new Date(timeString);
  dateFromtimeString.setMinutes(
    dateFromtimeString.getMinutes() - dateFromtimeString.getTimezoneOffset()
  );
  return dateFromtimeString;
};

module.exports = dateWithTimeZoneOffset;
