import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";
import { CronLogTransport } from "./logger/log-transporters";
import { CronLogLevel } from "./types";

export * from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export const chronos = new Chronos({
  initializationMethod: "respectMyConfig",
  logger: {
    level: CronLogLevel.NONE,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
});

const c1 = new Chronos({
  logger: {
    level: CronLogLevel.DEBUG,
    transporters: [
      new CronLogTransport.ConsoleTransport(),
      new CronLogTransport.FilesystemTransport({
        filepath: "./cron-logs-1",
      }),
    ],
  },
  initializationMethod: "autoStartAll",
});

const c2 = new Chronos({
  logger: {
    level: CronLogLevel.DEBUG,
    transporters: [
      new CronLogTransport.FilesystemTransport({
        filepath: "./cron-logs-2",
      }),
    ],
  },
  initializationMethod: "autoStartAll",
});

const t1 = c1.schedule(CronExpressions.EVERY_SECOND, () => {
  console.log("Using Chronos 1");
});

const t2 = c2.schedule(CronExpressions.EVERY_5_SECONDS, () => {
  console.log("Using Chronos 2");
});
