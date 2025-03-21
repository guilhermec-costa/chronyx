import { LoggerOptions } from "./logger/logger";

export type CronParts = {
  second: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
};

export const CRON_LIMITS = {
  second: [0, 59],
  minute: [0, 59],
  hour: [0, 23],
  dayOfMonth: [0, 31],
  month: [1, 12],
  dayOfWeek: [0, 7],
};

export type CronType = "IntervalBased" | "ExpressionBased" | "TimeoutBased";

export type ConfigOptions = {
  logger?: LoggerOptions;
};

export enum CronLogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  NONE = "none",
}
