import { Configurator } from "./configurator";
import { CronExpressions } from "./defined-expr";
import { CronLogger } from "./logger/logger";
import { PatternValidator } from "./pattern-validator";
import { WithExpression } from "./schedulers/with-expression";
import { WithOneShot } from "./schedulers/with-one-shot";
import { WithRecurrence } from "./schedulers/with-recurrence";
import { Task, TaskProxy } from "./task";
import { TaskManager } from "./task-manager";
import {
  ConfigOptions,
  CRON_LIMITS,
  CronLogLevel,
  SchedulingConstructor,
  SchedulingOptions,
} from "./types";
import { addSeconds, subSeconds } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { validateTimezone } from "./utils";
import { CronLogTransport } from "./logger/log-transporters";

export const DefaultChronosConfig: ConfigOptions = {
  logger: {
    level: CronLogLevel.INFO,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
};

export const DefaultSchedulingOptions: SchedulingOptions = {
  autoStart: true,
};
/**
 * Main class to manage scheduling tasks using cron-like expressions.
 */
export class Chronos {
  private readonly taskManager: TaskManager;
  private readonly patternValidator: PatternValidator;
  private readonly configurator: Configurator;
  private readonly logger: CronLogger;
  private readonly withExpressionScheduler: WithExpression;
  private readonly withOneShotScheduler: WithOneShot;
  private readonly withRecurrenceScheduler: WithRecurrence;

  /**
   * Initializes the Chronos scheduler with optional configuration.
   * @param config Optional configuration object for the scheduler.
   */
  constructor(config?: ConfigOptions) {
    this.configurator = new Configurator(config || DefaultChronosConfig);
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

  /**
   * Lists all registered tasks with their details.
   */
  public listTasks() {
    if (this.taskManager.taskStorage.length === 0) {
      this.logger.debug("Task Storage is empty");
      return;
    }

    for (const t of this.taskManager.taskStorage) {
      t.prettyPrint();
    }
  }

  /**
   * Returns the list of all registered tasks.
   * @returns Array of Task objects.
   */
  public tasks() {
    return this.taskManager.taskStorage;
  }

  /**
   * Generates future execution times based on the cron expression.
   * @param expr The cron expression.
   * @param n Number of future times to generate (default: 10).
   * @returns Array of future execution dates.
   */
  public previewNext(expr: string, n: number = 10, tz?: string) {
    this.logger.debug(
      `Generating ${n} future previews for expression: ${expr}, timezone ${tz}`
    );
    let previews: Date[] = [];
    let nextPreview: Date = tz ? toZonedTime(new Date(), tz) : new Date();
    const parsedCron = this.patternValidator.getCronPartsIfValid(expr);
    while (previews.length < n) {
      nextPreview = addSeconds(nextPreview, 1);
      if (this.patternValidator.matchesCron(nextPreview, parsedCron)) {
        previews.push(nextPreview);
      }
    }
    return previews;
  }

  public previewNextTaskExecution(t: Task, n: number) {
    return this.previewNext(t.expression, n, t.currentTimezone());
  }

  public previewPastTaskExecution(t: Task, n: number) {
    return this.previewPast(t.expression, n, t.currentTimezone());
  }

  /**
   * Generates past execution times based on the cron expression.
   * @param expr The cron expression.
   * @param n Number of past times to generate.
   * @returns Array of past execution dates.
   */
  public previewPast(expr: string, n: number, tz?: string) {
    this.logger.debug(
      `Generating ${n} past previews for expression: ${expr}, timezone ${tz}`
    );
    let previews: Date[] = [];
    let nextPreview: Date = tz ? toZonedTime(new Date(), tz) : new Date();
    const parsedCron = this.patternValidator.getCronPartsIfValid(expr);
    while (previews.length < n) {
      nextPreview = subSeconds(nextPreview, 1);
      if (this.patternValidator.matchesCron(nextPreview, parsedCron)) {
        previews.push(nextPreview);
      }
    }
    return previews;
  }

  /**
   * Schedules a task based on a cron expression or interval.
   * @param expr Cron expression or interval in seconds.
   * @param handler Function to execute.
   * @param options Additional scheduling options.
   * @returns The scheduled Task object.
   */
  public schedule(
    expr: string | CronExpressions,
    handler: VoidFunction,
    options?: SchedulingOptions
  ): TaskProxy {
    if (options?.timeZone) this.validateSchedulingTimezone(options.timeZone);
    return this.withExpressionScheduler.schedule({
      handler,
      repr: expr.toString(),
      options: options || DefaultSchedulingOptions,
    });
  }

  private validateSchedulingTimezone(tz: string) {
    if (!validateTimezone(tz)) {
      throw new Error(`"${tz}" is not a valid timezone`);
    }
  }

  public makeCron({
    expr,
    handler,
    options,
  }: SchedulingConstructor): TaskProxy {
    return this.schedule(expr, handler, options);
  }

  /**
   * Executes a task at a fixed frequency in seconds.
   * @param freq Frequency in seconds.
   * @param handler Function to execute.
   * @param options Additional scheduling options.
   * @returns The scheduled Task object.
   */
  public execEvery(
    freq: number,
    handler: VoidFunction,
    options?: SchedulingOptions
  ): TaskProxy {
    if (options?.timeZone) this.validateSchedulingTimezone(options.timeZone);
    return this.withRecurrenceScheduler.schedule({
      handler,
      repr: freq.toString(),
      options: options || DefaultSchedulingOptions,
    });
  }

  /**
   * Schedules a one-time task.
   * @param moment Date of execution.
   * @param handler Function to execute.
   * @param options Additional scheduling options.
   * @returns The scheduled Task object.
   */
  public oneShot(
    moment: Date,
    handler: VoidFunction,
    options?: SchedulingOptions
  ): TaskProxy {
    if (options?.timeZone) this.validateSchedulingTimezone(options.timeZone);
    return this.withOneShotScheduler.schedule({
      handler,
      repr: moment.toString(),
      options: options || DefaultSchedulingOptions,
    });
  }

  public validateCron(expr: string): boolean {
    try {
      const parts = this.patternValidator.parseExpr(expr);
      const isValid = this.patternValidator.validateCron(parts);
      return isValid;
    } catch (error) {
      return false;
    }
  }

  public expandedValues(expr: string) {
    const { dayOfWeek, month, dayOfMonth, hour, minute, second } =
      this.patternValidator.parseExpr(expr);

    return {
      second: this.patternValidator.expandField(
        second,
        CRON_LIMITS.second[0],
        CRON_LIMITS.second[1]
      ),
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

  /**
   * Checks if a given date matches a cron pattern.
   * @param moment Date to check.
   * @param expr The cron expression
   * @returns True if the date matches the cron pattern.
   */
  public matchesCron(moment: Date, expr: string) {
    const parsedCron = this.patternValidator.getCronPartsIfValid(expr);
    return this.patternValidator.matchesCron(moment, parsedCron);
  }
}
