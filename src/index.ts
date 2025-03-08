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

const c = new Chronos({
  logger: {
    level: CronLogLevel.DEBUG,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
  initializationMethod: "!autoStartAll",
});

const t = c.schedule(
  CronExpressions.EVERY_SECOND,
  () => {
    console.log("Hello world");
  },
  {
    name: "Task 1",
    autoStart: true,
  }
);
