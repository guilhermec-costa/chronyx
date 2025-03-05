import { PatternValidator } from "./pattern-validator";
import { Task, TaskManager } from "./task-manager";
import { CRON_LIMITS, ExecFrequency } from "./types";

export class Chronos {

  private taskManager: TaskManager = new TaskManager();
  private patternValidator: PatternValidator = new PatternValidator();

  public listTasks() {
    for (const t of this.taskManager.taskStorage) {
      t.prettyPrint();
    }
  }

  public schedule(expr: number | string, handler: () => void, times?: number): Task {
    switch (typeof expr) {
      case "string": {
        const isValid = this.patternValidator.validateExpr(expr);
        if (!isValid) {
          throw new Error(`Expression "${expr}" is not a valid cron expression`);
        }

        setInterval(() => {
          const moment = Date.now();
        }, 1000);
      }

      case "number": {
        return this.execEvery(Number(expr), handler, times);
      }
    }
  }

  public execEvery(freq: number | ExecFrequency, handler: () => void, times?: number) {
    let task: Task = this.taskManager.makeTask("unknown", freq.toString());
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

    const i  = setInterval(handler, freq);
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

  public validateExpr(expr: string): boolean {
    return this.patternValidator.validateExpr(expr);
  }

  public parseExpr(expr: string) {
    return this.patternValidator.parseExpr(expr);
  }

  public expandedValues(expr: string) {
    const {
      dayOfWeek,
      month,
      dayOfMonth,
      hour,
      minute,
      second
    } = this.parseExpr(expr);

    return {
      //@ts-ignore
      second: !!second ? this.patternValidator.expandField(second, ...CRON_LIMITS.second) : second,
      //@ts-ignore
      dayOfWeek: this.patternValidator.expandField(dayOfWeek, ...CRON_LIMITS.dayOfWeek),
      //@ts-ignore
      month: this.patternValidator.expandField(month, ...CRON_LIMITS.month),
      //@ts-ignore
      dayOfMonth: this.patternValidator.expandField(dayOfMonth, ...CRON_LIMITS.dayOfMonth),
      //@ts-ignore
      hour: this.patternValidator.expandField(hour, ...CRON_LIMITS.hour),
      //@ts-ignore
      minute: this.patternValidator.expandField(minute, ...CRON_LIMITS.minute),
    }
  }
}
