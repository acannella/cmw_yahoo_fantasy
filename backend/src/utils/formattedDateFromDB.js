/**
 *
 * @param {ISO 8601 string} timeString
 * @returns Date object from the timeString with 3 hours added on to make it Pacific time
 */
const formattedDateFromDB = function (timeString) {
  const dateFromtimeString = new Date(
    timeString.setHours(timeString.getHours() + 3)
  );
  return dateFromtimeString;
};

module.exports = formattedDateFromDB;
