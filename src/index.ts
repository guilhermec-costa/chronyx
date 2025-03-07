import { Chronos } from "./chronos";
import { CronExpressions } from "./defined-expr";

export * from "./types";
export { Chronos } from "./chronos";
export const chronos = new Chronos();

const c = new Chronos();
const t = c.schedule(
  CronExpressions.EVERY_SECOND,
  () => {
    console.log("Alguma coisa de background");
  },
  "My General Task",
  () => {
    console.log("Ticking");
  }
);

const prevNext = c.previewNext(CronExpressions.EVERY_5_MINUTES, 5);
const prevPrevious = c.previewPast(CronExpressions.EVERY_5_MINUTES, 5);
