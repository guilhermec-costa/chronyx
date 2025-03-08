import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";

export * from "./types";
export { Chronos } from "./chronos";
export const chronos = new Chronos();

const c = new Chronos();
const t = c.schedule(
  CronExpressions.EVERY_SECOND,
  () => {
    console.log("Task 1");
  },
  {
    name: "Task Test",
    autoStart: false,
    debugTick: () => {
      console.log("Ticking");
    },
  }
);

const prevNext = c.previewNext(CronExpressions.EVERY_5_MINUTES, 5);
const prevPrevious = c.previewPast(CronExpressions.EVERY_5_MINUTES, 5);

c.listTasks();

setTimeout(() => {
  t.resume();
}, 5000);
