import { Chronos, DefaultChronosConfig } from "./chronos";
import { CronExpressions } from "./defined-expr";
import { CronLogTransport } from "./logger/log-transporters";
import { CronLogLevel } from "./types";
export { CronLogLevel, type ConfigOptions } from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export * from "./logger/log-transporters";
export const chronos = new Chronos(DefaultChronosConfig);

const c = new Chronos({
  logger: {
    level: CronLogLevel.INFO,
    transporters: [
      new CronLogTransport.FilesystemTransport({
        filepath: "test-cron",
      }),
    ],
  },
});

const t2 = c.makeCron({
  expr: "57 * * * * *",
  handler: () => {
    console.log("Test cron");
  },
  options: {
    timeZone: "America/Sao_Paulo",
  },
});
