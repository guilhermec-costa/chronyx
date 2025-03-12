import { Configurator } from "../configurator";
import { CronLogger } from "../logger/logger";
import { PatternValidator } from "../pattern-validator";
import { Task } from "../task";
import { TaskManager } from "../task-manager";

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
    const { initializationMethod } = this.configurator.configs;
    if (initializationMethod === "respectMyConfig") {
      if (t.canAutoStart()) {
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
}
