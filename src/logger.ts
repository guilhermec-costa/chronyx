export enum CronLogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  NONE = "none",
}

export interface LoggerOptions {
  level?: CronLogLevel;
}

export class CronLogger {
  private static level: CronLogLevel;

  public static configure({ level = CronLogLevel.INFO }: LoggerOptions) {
    this.level = level;
  }

  public static log(level: CronLogLevel, msg: string) {
    if (this.shouldLog(level)) {
      const output = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`;
      console.log(output);
    }
  }

  public static shouldLog(level: CronLogLevel) {
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
