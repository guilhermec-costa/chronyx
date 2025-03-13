import { Configurator } from "../configurator";
import { CronLogger } from "../logger/logger";
import { PatternValidator } from "../pattern-validator";
import { Task } from "../task";
import { TaskManager } from "../task-manager";
import { CronParts } from "../types";

export abstract class Scheduler {
  protected readonly logger: CronLogger;
  public constructor(
    protected readonly taskManager: TaskManager,
    protected readonly configurator: Configurator,
    protected readonly patternValidator: PatternValidator
  ) {
    this.logger = this.configurator.logger;
  }

  public applyAutoStartConfig(t: Task) {
    if (t.canAutoStart()) {
      t.resume();
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

  protected defineTimeout({ second, minute }: CronParts) {
    const A_SECOND = 1000;
    if (second === "0" && minute === "0") {
      return A_SECOND * 60 * 60;
    }

    if (second === "0") {
      return A_SECOND * 60;
    }

    return A_SECOND;
  }
}
