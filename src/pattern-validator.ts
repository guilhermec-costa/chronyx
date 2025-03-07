import { CRON_LIMITS, CronParts } from "./types";

export class PatternValidator {
  private static instance: PatternValidator;

  private constructor() {}

  public static singleton(): PatternValidator {
    if (!this.instance) {
      this.instance = new PatternValidator();
    }

    return PatternValidator.instance;
  }

  public parseExpr(expr: string): CronParts {
    const exprParts = expr.trim().split(/\s+/);
    const exprLen = exprParts.length;
    if (exprLen < 5 || exprLen > 6) {
      throw new Error("Cron expression should have 5 or 6 fields");
    }

    let second, minute, hour, dayOfMonth, month, dayOfWeek;
    if (exprLen === 5) {
      [minute, hour, dayOfMonth, month, dayOfWeek] = exprParts;
    } else {
      [second, minute, hour, dayOfMonth, month, dayOfWeek] = exprParts;
    }

    return {
      second,
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
    };
  }

  public expandField(
    field: string,
    lowerLimit: number,
    upperLimit: number
  ): number[] {
    if (field === "*")
      return Array.from(
        { length: upperLimit - lowerLimit + 1 },
        (_, i) => i + lowerLimit
      );

    if (field.includes("*/")) {
      const step = +field.split("*/")[1];
      return Array.from(
        { length: Math.floor((upperLimit - lowerLimit + 1) / step) },
        (_, i) => lowerLimit + i * step
      );
    }

    if (field.includes("-")) {
      return field.split("-").map(Number);
    }

    if (field.includes(",")) {
      return field.split(",").map(Number);
    }

    return [Number(field)];
  }

  public validateField(field: string, min: number, max: number) {
    const values = this.expandField(field, min, max);
    return values.every((v) => v >= min && v <= max);
  }

  public validateCron(cron: CronParts) {
    return (
      (cron.second
        ? this.validateField(
            cron.second,
            CRON_LIMITS.second[0],
            CRON_LIMITS.second[1]
          )
        : true) &&
      this.validateField(
        cron.minute,
        CRON_LIMITS.minute[0],
        CRON_LIMITS.minute[1]
      ) &&
      this.validateField(cron.hour, CRON_LIMITS.hour[0], CRON_LIMITS.hour[1]) &&
      this.validateField(
        cron.dayOfMonth,
        CRON_LIMITS.dayOfMonth[0],
        CRON_LIMITS.dayOfMonth[1]
      ) &&
      this.validateField(
        cron.month,
        CRON_LIMITS.month[0],
        CRON_LIMITS.month[1]
      ) &&
      this.validateField(
        cron.dayOfWeek,
        CRON_LIMITS.dayOfWeek[0],
        CRON_LIMITS.dayOfWeek[1]
      )
    );
  }
}
