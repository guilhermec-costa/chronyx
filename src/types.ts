import { CronExpressions } from "./defined-expr";
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

export type CronType = "IntervalBased" | "ExpressionBased";

export type TaskArgs = {
  repr: string;
  handler: () => void;
  options: SchedulingOptions;
};

export type SchedulingConstructor = {
  expr: number | string | CronExpressions;
  handler: VoidFunction;
  options: SchedulingOptions;
};

export type SchedulingOptions = {
  name?: string;
  debugTick?: VoidFunction;
  autoStart?: boolean;
  timeZone?: string;
};

export type ConfigOptions = {
  logger?: LoggerOptions;
  initializationMethod?: "autoStartAll" | "!autoStartAll" | "respectMyConfig";
};

export enum CronLogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  NONE = "none",
}

export type CronValidationResult = {
  valid: boolean;
  error?: string;
};
