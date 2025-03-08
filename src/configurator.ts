import { CronLogger } from "./logger";
import { ConfigOptions } from "./types";

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
    CronLogger.configure({
      level: this.configs.logger?.level,
    });
  }
}
