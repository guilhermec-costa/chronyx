import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";
import { CronLogLevel } from "./logger";

export * from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export const chronos = new Chronos({
  initializationMethod: "respectMyConfig",
  logger: {
    level: CronLogLevel.NONE,
  },
});

const c = new Chronos({
  logger: {
    level: CronLogLevel.DEBUG,
  },
  initializationMethod: "respectMyConfig",
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
