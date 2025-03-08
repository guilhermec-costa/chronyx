import { CronLogLevel } from "../types";
import { CronLogTransport, LogTransport } from "./log-transporters";

export interface LoggerOptions {
  level: CronLogLevel;
  transporters: Array<LogTransport>;
}

export class CronLogger {
  private static level: CronLogLevel;
  private static logTransporters: Array<LogTransport>;

  public static configure({
    level = CronLogLevel.INFO,
    transporters,
  }: LoggerOptions) {
    this.level = level;
    this.logTransporters =
      transporters || new CronLogTransport.ConsoleTransport();
  }

  public static log(level: CronLogLevel, msg: string) {
    if (this.shouldLog(level)) {
      const output = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`;
      for (const transport of this.logTransporters) {
        transport.log(output);
      }
    }
  }

  private static shouldLog(level: CronLogLevel) {
    const levels = Object.values(CronLogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  public static debug(msg: string) {
    this.log(CronLogLevel.DEBUG, msg);
  }

  public static info(msg: string) {
    this.log(CronLogLevel.INFO, msg);
  }

  public static warn(msg: string) {
    this.log(CronLogLevel.WARN, msg);
  }

  public static error(msg: string) {
    this.log(CronLogLevel.ERROR, msg);
  }
}
