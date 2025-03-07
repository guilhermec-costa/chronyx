export enum CronExpressions {
  EVERY_SECOND = "* * * * * *",
  EVERY_MINUTE = "0 * * * * *",
  EVERY_HOUR = "0 0 * * * *",
  EVERY_DAY_MIDNIGHT = "0 0 0 * * *",
  EVERY_WEEK = "0 0 0 * * 0",
  EVERY_MONTH = "0 0 0 1 * *",
  EVERY_YEAR = "0 0 0 1 1 *",
  WEEKDAYS_AT_9AM = "0 0 9 * * 1-5",
  FIRST_DAY_OF_MONTH_8AM = "0 0 8 1 * *",
  EVERY_5_MINUTES = "0 */5 * * * *",
  EVERY_10_SECONDS = "*/10 * * * * *",
  EVERY_15_MINUTES = "0 */15 * * * *",
}
