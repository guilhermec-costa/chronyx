import { CronLogLevel } from "../types";
import { CronLogTransport, LogTransport } from "./log-transporters";

export interface LoggerOptions {
  level: CronLogLevel;
  transporters: Array<LogTransport>;
}

export class CronLogger {
  private level: CronLogLevel;
  private logTransporters: Array<LogTransport>;

  public constructor({
    level = CronLogLevel.INFO,
    transporters,
  }: LoggerOptions) {
    this.level = level;
    this.logTransporters =
      transporters || new CronLogTransport.ConsoleTransport();
  }

  public log(level: CronLogLevel, msg: string) {
    if (this.shouldLog(level)) {
      const output = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`;
      for (const transport of this.logTransporters) {
        transport.log(output);
      }
    }
  }

  private shouldLog(level: CronLogLevel) {
    const levels = Object.values(CronLogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  public debug(msg: string) {
    this.log(CronLogLevel.DEBUG, msg);
  }

  public info(msg: string) {
    this.log(CronLogLevel.INFO, msg);
  }

  public warn(msg: string) {
    this.log(CronLogLevel.WARN, msg);
  }

  public error(msg: string) {
    this.log(CronLogLevel.ERROR, msg);
  }
}
