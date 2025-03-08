import { Configurator } from "./configurator";
import { CronExpressions } from "./defined-expr";
import { CronLogger } from "./logger/logger";
import { PatternValidator } from "./pattern-validator";
import { Scheduler } from "./schedulers/scheduler";
import { WithExpression } from "./schedulers/with-expression";
import { WithOneShot } from "./schedulers/with-one-shot";
import { WithRecurrence } from "./schedulers/with-recurrence";
import { Task } from "./task";
import { TaskManager } from "./task-manager";
import {
  ConfigOptions,
  CRON_LIMITS,
  CronParts,
  SchedulingConstructor,
  SchedulingOptions,
} from "./types";
import { addSeconds, subSeconds } from "date-fns";

export class Chronos {
  private readonly taskManager: TaskManager;
  private readonly patternValidator: PatternValidator;
  private readonly configurator: Configurator;
  private readonly logger: CronLogger;
  private readonly withExpressionScheduler: WithExpression;
  private readonly withOneShotScheduler: WithOneShot;
  private readonly withRecurrenceScheduler: WithRecurrence;

  constructor(config?: ConfigOptions) {
    this.configurator = new Configurator(config || {});
    this.taskManager = new TaskManager(this.configurator);
    this.patternValidator = new PatternValidator();
    this.logger = this.configurator.logger;
    this.logger.info("Chronos initialized");
    if (config) {
      this.logger.info("Configuration applied to Chronos instance");
    }

    this.withExpressionScheduler = new WithExpression(
      this.taskManager,
      this.configurator,
      this.patternValidator
    );
    this.withOneShotScheduler = new WithOneShot(
      this.taskManager,
      this.configurator,
      this.patternValidator
    );
    this.withRecurrenceScheduler = new WithRecurrence(
      this.taskManager,
      this.configurator,
      this.patternValidator
    );
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

  public tasks() {
    return this.taskManager.taskStorage;
  }

  public cronValidationProxy(expr: string): CronParts {
    const parsedCron = this.patternValidator.parseExpr(expr);
    const validCron = this.patternValidator.validateCron(parsedCron);
    if (!validCron) {
      throw new Error("Expression is not valid");
    }

    return parsedCron;
  }

  public previewNext(expr: string, n: number = 10) {
    this.logger.debug(
      `Generating ${n} future previews for expression: ${expr}`
    );
    let previews: Date[] = [];
    let nextPreview: Date = new Date();
    const parsedCron = this.cronValidationProxy(expr);
    while (previews.length < n) {
      nextPreview = addSeconds(nextPreview, 1);
      if (this.matchesCron(nextPreview, parsedCron)) {
        previews.push(nextPreview);
      }
    }
    return previews;
  }

  public previewPast(expr: string, n: number) {
    this.logger.debug(`Generating ${n} past previews for expression: ${expr}`);
    let previews: Date[] = [];
    let nextPreview: Date = new Date();
    const parsedCron = this.cronValidationProxy(expr);
    while (previews.length < n) {
      nextPreview = subSeconds(nextPreview, 1);
      if (this.matchesCron(nextPreview, parsedCron)) {
        previews.push(nextPreview);
      }
    }
    return previews;
  }

  public schedule(
    expr: number | string | CronExpressions,
    handler: VoidFunction,
    options?: SchedulingOptions
  ): Task {
    switch (typeof expr) {
      case "string": {
        return this.withExpressionScheduler.schedule({
          handler,
          repr: expr.toString(),
          options: options || {},
        });
      }

      case "number": {
        return this.withRecurrenceScheduler.schedule({
          handler,
          repr: expr.toString(),
          options: options || {},
        });
      }
    }
  }

  public makeCron({ expr, handler, options }: SchedulingConstructor) {
    this.schedule(expr, handler, options);
  }

  public execEvery(
    freq: number,
    handler: VoidFunction,
    options: SchedulingOptions
  ): Task {
    return this.withRecurrenceScheduler.schedule({
      handler,
      repr: freq.toString(),
      options,
    });
  }

  public oneShot(
    moment: Date,
    handler: VoidFunction,
    options: SchedulingOptions
  ): Task {
    return this.withOneShotScheduler.schedule({
      handler,
      repr: moment.toString(),
      options,
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
    return this.patternValidator.matchesCron(moment, cron);
  }
}
