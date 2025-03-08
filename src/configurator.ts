import { CronLogger } from "./logger/logger";
import { ConfigOptions, CronLogLevel } from "./types";

export class Configurator {
  private static instance: Configurator;
  public configs!: ConfigOptions;
  private constructor() {}

  public static singleton(): Configurator {
    if (!this.instance) {
      this.instance = new Configurator();
    }

    return Configurator.instance;
  }

  public addConfig(opts: ConfigOptions) {
    this.configs = opts;
    CronLogger.configure(
      opts.logger || {
        level: CronLogLevel.NONE,
        transportersTypes: ["console"],
      }
    );
  }
}
