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
  CronExpressions.EVERY_SECOND,
  () => {
    console.log("Task 1 executing");
  },
  {
    autoStart: false,
    name: "Task 1",
  }
);

c.execEvery(
  1000,
  () => {
    console.log("hey");
  },
  {
    autoStart: true,
  }
);

c.listTasks();
