import { PatternValidator } from "../pattern-validator";
import { TaskManager } from "../task-manager";
import { CRON_LIMITS, CronParts } from "../types";

export abstract class Scheduler {
  protected static readonly taskManager: TaskManager = TaskManager.singleton();
  protected static readonly patternValidator: PatternValidator =
    PatternValidator.singleton();

  public static cronValidationProxy(expr: string): CronParts {
    const parsedCron = this.patternValidator.parseExpr(expr);
    const validCron = this.patternValidator.validateCron(parsedCron);
    if (!validCron) {
      throw new Error("Expression is not valid");
    }

    return parsedCron;
  }

  public static dateComponents(date: Date) {
    const second = date.getSeconds();
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return {
      second,
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
    };
  }
  public static matchesCron(moment: Date, cron: CronParts) {
    const { dayOfMonth, dayOfWeek, hour, minute, month, second } =
      this.dateComponents(moment);

    return (
      (cron.second
        ? this.patternValidator
            .expandField(
              cron.second,
              CRON_LIMITS.second[0],
              CRON_LIMITS.second[1]
            )
            .includes(second)
        : true) &&
      this.patternValidator
        .expandField(cron.minute, CRON_LIMITS.minute[0], CRON_LIMITS.minute[1])
        .includes(minute) &&
      this.patternValidator
        .expandField(cron.hour, CRON_LIMITS.hour[0], CRON_LIMITS.hour[1])
        .includes(hour) &&
      this.patternValidator
        .expandField(
          cron.dayOfMonth,
          CRON_LIMITS.dayOfMonth[0],
          CRON_LIMITS.dayOfMonth[1]
        )
        .includes(dayOfMonth) &&
      this.patternValidator
        .expandField(cron.month, CRON_LIMITS.month[0], CRON_LIMITS.month[1])
        .includes(month) &&
      this.patternValidator
        .expandField(
          cron.dayOfWeek,
          CRON_LIMITS.dayOfWeek[0],
          CRON_LIMITS.dayOfWeek[1]
        )
        .includes(dayOfWeek)
    );
  }
}
