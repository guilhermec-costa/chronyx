import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";

export * from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export const chronos = new Chronos();

const c = new Chronos({
  logger: {
    level: "debug",
  },
});

const t = c.schedule(
  CronExpressions.EVERY_5_SECONDS,
  () => {
    console.log("Task 1 executing");
  },
  {
    autoStart: false,
    name: "Task 1",
  }
);

console.log(c.previewNext(t.expression, 10));
