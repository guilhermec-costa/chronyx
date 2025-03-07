import { PatternValidator } from "./pattern-validator";
import { Scheduler } from "./schedulers/scheduler";
import { WithExpression } from "./schedulers/with-expression";
import { WithOneShot } from "./schedulers/with-one-shot";
import { WithRecurrence } from "./schedulers/with-recurrence";
import { Task } from "./task";
import { TaskManager } from "./task-manager";
import { CRON_LIMITS, CronParts, ExecFrequency } from "./types";
import { addSeconds, subSeconds } from "date-fns";

export class Chronos {
  private readonly taskManager: TaskManager;
  private readonly patternValidator: PatternValidator;

  constructor() {
    this.taskManager = TaskManager.singleton();
    this.patternValidator = PatternValidator.singleton();
  }

  public listTasks() {
    if (this.taskManager.taskStorage.length === 0) {
      console.log("Task Storage is empty");
      return;
    }

    for (const t of this.taskManager.taskStorage) {
      t.prettyPrint();
    }
  }

  public previewNext(expr: string, n: number = 10) {
    let previews: Date[] = [];
    let nextPreview: Date = new Date();
    Scheduler.cronValidationProxy(expr);
    const expdFields = this.expandedValues(expr);

    while (previews.length < n) {
      nextPreview = addSeconds(nextPreview, 1);
      const current = Scheduler.dateComponents(nextPreview);
      const matches =
        expdFields.second.includes(current.second) &&
        expdFields.minute.includes(current.minute) &&
        expdFields.hour.includes(current.hour) &&
        expdFields.dayOfMonth.includes(current.dayOfMonth) &&
        expdFields.dayOfWeek.includes(current.dayOfWeek) &&
        expdFields.month.includes(current.month);

      if (matches) {
        previews.push(nextPreview);
      }
    }

    return previews;
  }

  public previewPast(expr: string, n: number) {
    let previews: Date[] = [];
    let nextPreview: Date = new Date();
    Scheduler.cronValidationProxy(expr);
    const expdFields = this.expandedValues(expr);

    while (previews.length < n) {
      nextPreview = subSeconds(nextPreview, 1);
      const current = Scheduler.dateComponents(nextPreview);
      const matches =
        expdFields.second.includes(current.second) &&
        expdFields.minute.includes(current.minute) &&
        expdFields.hour.includes(current.hour) &&
        expdFields.dayOfMonth.includes(current.dayOfMonth) &&
        expdFields.dayOfWeek.includes(current.dayOfWeek) &&
        expdFields.month.includes(current.month);

      if (matches) {
        previews.push(nextPreview);
      }
    }

    return previews;
  }

  public schedule(
    expr: number | string,
    handler: () => void,
    name?: string
  ): Task {
    switch (typeof expr) {
      case "string": {
        return WithExpression.schedule({
          handler,
          name: name || "unknown",
          repr: expr.toString(),
        });
      }

      case "number": {
        return WithRecurrence.schedule({
          handler,
          name: name || "unknown",
          repr: expr.toString(),
        });
      }
    }
  }

  public execEvery(
    freq: number | ExecFrequency,
    handler: () => void,
    name?: string
  ): Task {
    return WithRecurrence.schedule({
      handler,
      name: name || "unknown",
      repr: freq.toString(),
    });
  }

  public oneShot(moment: Date, handler: () => void, name?: string): Task {
    return WithOneShot.schedule({
      handler,
      name: name || "unknown",
      repr: moment.toString(),
    });
  }

  public validateCron(expr: string) {
    const parts = this.patternValidator.parseExpr(expr);
    return this.patternValidator.validateCron(parts);
  }

  public expandedValues(expr: string) {
    const { dayOfWeek, month, dayOfMonth, hour, minute, second } =
      this.patternValidator.parseExpr(expr);

    return {
      //@ts-ignore
      second: second
        ? this.patternValidator.expandField(
            second,
            CRON_LIMITS.second[0],
            CRON_LIMITS.second[1]
          )
        : [],
      dayOfWeek: this.patternValidator.expandField(
        dayOfWeek,
        CRON_LIMITS.dayOfWeek[0],
        CRON_LIMITS.dayOfWeek[1]
      ),
      month: this.patternValidator.expandField(
        month,
        CRON_LIMITS.month[0],
        CRON_LIMITS.month[1]
      ),
      dayOfMonth: this.patternValidator.expandField(
        dayOfMonth,
        CRON_LIMITS.dayOfMonth[0],
        CRON_LIMITS.dayOfMonth[1]
      ),
      hour: this.patternValidator.expandField(
        hour,
        CRON_LIMITS.hour[0],
        CRON_LIMITS.hour[1]
      ),
      minute: this.patternValidator.expandField(
        minute,
        CRON_LIMITS.minute[0],
        CRON_LIMITS.minute[1]
      ),
    };
  }

  public matchesCron(moment: Date, cron: CronParts) {
    return Scheduler.matchesCron(moment, cron);
  }
}
