import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";
import { CronLogTransport } from "./logger/log-transporters";
import {
  toZonedTime,
  fromZonedTime,
  formatInTimeZone,
  getTimezoneOffset,
} from "date-fns-tz";
import { CronLogLevel } from "./types";

export * from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export * from "./logger/log-transporters";
export const chronos = new Chronos({
  initializationMethod: "autoStartAll",
  logger: {
    level: CronLogLevel.NONE,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
});

const c = new Chronos({
  logger: {
    level: CronLogLevel.DEBUG,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
  initializationMethod: "autoStartAll",
});

c.schedule("* * 25 * * *", () => {
  console.log("Testing cron 1");
});

c.schedule(
  "* * 3 * * *",
  () => {
    console.log("Testing cron 1");
  },
  {
    timeZone: "America/Los_Angeles",
  }
);

const t = c.schedule("0 0 3 * * *", () => {
  console.log("Testing cron 2");
});

console.log(c.previewNextTaskExecution(t, 5));
console.log(c.previewPastTaskExecution(t, 5));
