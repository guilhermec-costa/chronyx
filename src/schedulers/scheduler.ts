import { Configurator } from "../configurator";
import { CronLogger } from "../logger/logger";
import { PatternValidator } from "../pattern-validator";
import { DebugTickerExecutor, Task } from "../task";
import { TaskManager } from "../task-manager";
import { CRON_LIMITS, CronParts } from "../types";
import { dateComponents } from "../utils";

export abstract class Scheduler {
  protected readonly logger: CronLogger;
  public constructor(
    protected readonly taskManager: TaskManager,
    protected readonly configurator: Configurator,
    protected readonly patternValidator: PatternValidator
  ) {
    this.logger = this.configurator.logger;
  }

  public cronValidationProxy(expr: string): CronParts {
    const parsedCron = this.patternValidator.parseExpr(expr);
    const validCron = this.patternValidator.validateCron(parsedCron);
    if (!validCron) {
      throw new Error("Expression is not valid");
    }

    return parsedCron;
  }

  public applyAutoStartConfig(t: Task) {
    const { initializationMethod } = this.configurator.configs;
    if (initializationMethod === "respectMyConfig") {
      if (t.autoStart) {
        t.resume();
      }
      return;
    }
    if (initializationMethod === "autoStartAll") {
      t.resume();
      return;
    }
  }

  protected debugTickerActivator(t: Task, cb: VoidFunction): NodeJS.Timeout {
    const tickerId = setInterval(() => {
      if (t.ableToRun()) {
        cb();
      }
    }, 1000);
    return tickerId;
  }

  public matchesCron(moment: Date, cron: CronParts) {
    const { dayOfMonth, dayOfWeek, hour, minute, month, second } =
      dateComponents(moment);

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
