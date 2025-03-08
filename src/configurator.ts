import { CronLogTransport } from "./logger/log-transporters";
import { CronLogger } from "./logger/logger";
import { ConfigOptions, CronLogLevel } from "./types";

export class Configurator {
  public configs!: ConfigOptions;
  public logger: CronLogger;

  public constructor(opts: ConfigOptions) {
    this.configs = opts;
    this.logger = new CronLogger(
      opts.logger || {
        level: CronLogLevel.NONE,
        transporters: [new CronLogTransport.ConsoleTransport()],
      }
    );
  }
}
