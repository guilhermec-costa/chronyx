import { PatternValidator } from "./pattern-validator";
import { Task, TaskManager } from "./task-manager";
import { CRON_LIMITS, CronParts, ExecFrequency } from "./types";

export class Chronos {
  private taskManager: TaskManager = new TaskManager();
  private patternValidator: PatternValidator = new PatternValidator();

  public listTasks() {
    for (const t of this.taskManager.taskStorage) {
      t.prettyPrint();
    }
  }

  public schedule(
    expr: number | string,
    handler: () => void,
    times?: number
  ): Task {
    switch (typeof expr) {
      case "string": {
        const parsedCron = this.patternValidator.parseExpr(expr);
        const validCron = this.patternValidator.validateCron(parsedCron);
        if (!validCron) {
          throw new Error("Expression is not valid");
        }

        const i = setInterval(() => {
          const now = new Date();
          if (this.matchesCron(now, parsedCron)) {
            handler();
          }
        }, 1000);
        let task: Task = this.taskManager.makeTask(
          "unknown",
          expr,
          handler,
          "ExpressionBased",
          i
        );
        return task;
      }

      case "number": {
        return this.execEvery(Number(expr), handler, times);
      }
    }
  }

  public execEvery(
    freq: number | ExecFrequency,
    handler: () => void,
    times?: number
  ) {
    let task: Task = this.taskManager.makeTask(
      "unknown",
      freq.toString(),
      handler,
      "ExpressionBased"
    );
    if (freq < 0) {
      throw new Error("frequency interval must be greater than 0");
    }

    if (times) {
      const i = setInterval(() => {
        handler();
        if (task.getExecTimes() >= times) {
          clearInterval(i);
        }
      });
      task.setExecutorId(i);
      this.taskManager.addIntervalTask(task);
      return task;
    }

    const i = setInterval(handler, freq);
    task.setExecutorId(i);
    return task;
  }

  public oneShot(moment: Date, handler: () => void) {
    const isMomentValid = moment.getTime() >= Date.now();
    if (!isMomentValid) {
      throw new Error("Target date should be greater/equal to current date");
    }

    const timer = setInterval(() => {
      if (Date.now() >= moment.getTime()) {
        handler();
        clearInterval(timer);
      }
    }, 1000);
  }

  public parseExpr(expr: string) {
    return this.patternValidator.parseExpr(expr);
  }

  public expandedValues(expr: string) {
    const { dayOfWeek, month, dayOfMonth, hour, minute, second } =
      this.parseExpr(expr);

    return {
      //@ts-ignore
      second: !!second
        ? this.patternValidator.expandField(
            second,
            CRON_LIMITS.second[0],
            CRON_LIMITS.second[1]
          )
        : second,
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
    const second = moment.getSeconds();
    const minute = moment.getMinutes();
    const hour = moment.getHours();
    const dayOfMonth = moment.getDate();
    const month = moment.getMonth() + 1;
    const dayOfWeek = moment.getDay();

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
        .expandField(cron.hour, CRON_LIMITS.minute[0], CRON_LIMITS.minute[1])
        .includes(hour) &&
      this.patternValidator
        .expandField(
          cron.dayOfMonth,
          CRON_LIMITS.minute[0],
          CRON_LIMITS.minute[1]
        )
        .includes(dayOfMonth) &&
      this.patternValidator
        .expandField(cron.month, CRON_LIMITS.minute[0], CRON_LIMITS.minute[1])
        .includes(month) &&
      this.patternValidator
        .expandField(
          cron.dayOfWeek,
          CRON_LIMITS.minute[0],
          CRON_LIMITS.minute[1]
        )
        .includes(dayOfWeek)
    );
  }
}
