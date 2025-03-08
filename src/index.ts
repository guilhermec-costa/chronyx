import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";

export * from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export const chronos = new Chronos({
  initializationMethod: "respectMyConfig",
  logger: {
    level: "none",
  },
});

const c = new Chronos({
  logger: {
    level: "debug",
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
    autoStart: false,
  }
);
