import { Chronos } from "./chronos";
import { CronLogTransport } from "./logger/log-transporters";
import { CronLogLevel } from "./types";

export { CronLogLevel, type ConfigOptions } from "./types";
export * from "./defined-expr";
export { Chronos } from "./chronos";
export * from "./logger/log-transporters";
export const chronos = new Chronos({
  initializationMethod: "autoStartAll",
  logger: {
    level: CronLogLevel.INFO,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
});
