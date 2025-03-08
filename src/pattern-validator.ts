import { ExpanderFabric } from "./field-expanders/expanderFabric";
import { CRON_LIMITS, CronParts } from "./types";
import { dateComponents } from "./utils";

export class PatternValidator {
  public constructor() {}

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
    const expander = ExpanderFabric.getExpander(field, lowerLimit, upperLimit);
    if (!expander) return [Number(field)];
    return expander.expand(field, lowerLimit, upperLimit);
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

  public matchesCron(moment: Date, cron: CronParts) {
    const { dayOfMonth, dayOfWeek, hour, minute, month, second } =
      dateComponents(moment);

    return (
      (cron.second
        ? this.expandField(
            cron.second,
            CRON_LIMITS.second[0],
            CRON_LIMITS.second[1]
          ).includes(second)
        : true) &&
      this.expandField(
        cron.minute,
        CRON_LIMITS.minute[0],
        CRON_LIMITS.minute[1]
      ).includes(minute) &&
      this.expandField(
        cron.hour,
        CRON_LIMITS.hour[0],
        CRON_LIMITS.hour[1]
      ).includes(hour) &&
      this.expandField(
        cron.dayOfMonth,
        CRON_LIMITS.dayOfMonth[0],
        CRON_LIMITS.dayOfMonth[1]
      ).includes(dayOfMonth) &&
      this.expandField(
        cron.month,
        CRON_LIMITS.month[0],
        CRON_LIMITS.month[1]
      ).includes(month) &&
      this.expandField(
        cron.dayOfWeek,
        CRON_LIMITS.dayOfWeek[0],
        CRON_LIMITS.dayOfWeek[1]
      ).includes(dayOfWeek)
    );
  }
}
