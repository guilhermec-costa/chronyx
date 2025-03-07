import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";

export * from "./types";
export { Chronos } from "./chronos";
export const chronos = new Chronos();

const c = new Chronos();
const task1 = c.schedule(
  CronExpressions.EVERY_SECOND,
  () => {
    console.log("Task 1");
  },
  "Task 1"
);
// const task2 = c.schedule(CronExpressions.EVERY_10_SECONDS, () => {}, "Task 2");

setTimeout(() => {
  task1.pause();
}, 3000);

setTimeout(() => {
  task1.changeState("RUNNING");
}, 7000);

setTimeout(() => {
  task1.stop();
}, 10000);

c.listTasks();
