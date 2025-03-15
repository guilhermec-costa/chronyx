import { addSeconds } from "date-fns";
import { Chronos, DefaultChronosConfig } from "./chronos";
import { CronExpressions } from "./defined-expr";
import { CronLogLevel } from "./types";
export { CronLogLevel, type ConfigOptions } from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export * from "./logger/log-transporters";
export const chronos = new Chronos(DefaultChronosConfig);

const c = new Chronos({
  logger: {
    level: CronLogLevel.DEBUG,
  },
});

// class TestCron {
//   @c.Timeout(4000)
//   public fn() {
//     console.log("hello world");
//   }

//   @c.Scheduler(CronExpressions.EVERY_5_SECONDS, {
//     name: "Scheduler Task",
//   })
//   public schedulerJob() {
//     console.log("uhum");
//   }

//   @c.OneShot(addSeconds(new Date(), 3), {
//     debugTick: () => {
//       console.log("Ticking for oneShoty");
//     },
//   })
//   public oneShotJob() {
//     console.log("Gets the time");
//   }

//   @c.Every(2000)
//   public everyJob() {
//     console.log("Lightweight baby");
//   }
// }

c.Every(500, {});
