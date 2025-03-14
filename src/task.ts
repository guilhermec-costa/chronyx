import { TaskManager } from "./task-manager";
import { CronParts, CronType } from "./types";
import { v4 as uuidv4, v4 } from "uuid";
import EventEmitter from "events";

export type TaskStatus = "CREATED" | "RUNNING" | "KILLED";

export class TimeoutExecutor {
  /**
   * Represents an executor for scheduled tasks in debug mode.
   *
   * @param executorId - The unique identifier for the executor.
   * @param cb - The callback function to be executed.
   */
  constructor(
    public readonly executorId: NodeJS.Timeout,
    public readonly cb: VoidFunction
  ) {}
}
export class Task {
  private readonly id: string;
  public readonly name: string;
  public readonly expression: string;
  private handler: VoidFunction;
  private readonly cronType: CronType;
  private status: TaskStatus;
  private readonly cronParts?: CronParts;
  private readonly autoStart: boolean;
  private lastRunAt?: Date;
  private readonly emitter: EventEmitter;
  private readonly tz: string;
  private presentableHandler: VoidFunction;
  private initFn?: VoidFunction;

  /**
   * Creates a new scheduled task instance.
   *
   * @param name - The name of the task.
   * @param expression - The cron expression or recurrence pattern.
   * @param handler - The function to be executed when the task runs.
   * @param cronType - The type of cron (e.g., interval, cron expression).
   * @param emitter - Event emitter to manage task events.
   * @param cronParts - Parsed cron parts (optional).
   * @param autoStart - Whether the task should start automatically (default: true).
   */
  constructor(
    name: string,
    expression: string,
    handler: VoidFunction,
    cronType: CronType,
    emitter: EventEmitter,
    cronParts?: CronParts,
    autoStart: boolean = true,
    timezone: string = "utc"
  ) {
    this.id = uuidv4();
    this.name = name;
    this.expression = expression;
    this.presentableHandler = handler;
    this.handler = () => {
      handler();
      this.lastRunAt = new Date();
    };
    this.cronType = cronType;
    this.status = "CREATED";
    this.cronParts = cronParts;
    this.autoStart = autoStart;
    this.emitter = emitter;
    this.tz = timezone;
  }

  public setInitFn(fn: VoidFunction) {
    this.initFn = fn;
  }

  public start() {
    if (this.initFn) {
      this.status = "RUNNING";
      this.initFn();
      this.initFn = undefined;
    } else {
      throw new Error("Task was already started");
    }
  }
  /**
   * Prints the task details in a human-readable format.
   */
  public prettyPrint() {
    console.log(
      `
---------------------
Task Details:
---------------------
ID: ${this.id}
Name: ${this.name}
Type: ${this.cronType}
Status: ${this.status}
Expression: ${this.expression}
Handler: ${this.presentableHandler.toString()}
AutoStart: ${this.autoStart}
LastRun: ${this.lastRunAt?.toString()}
Timezone: ${this.tz}`
    );
  }

  public exec() {
    if (this.status === "RUNNING") {
      this.handler();
    }
  }

  public getStatus() {
    return this.status;
  }
  /**
   * Stops the task by emitting a "kill-task" event.
   */
  public kill() {
    this.emitter.emit("kill-task", this.getId());
    this.status = "KILLED";
  }

  /**
   * Retrieves the unique identifier of the task.
   *
   * @returns The task ID.
   */
  public getId() {
    return this.id;
  }

  public getCronParts(): CronParts | undefined {
    return this.cronParts;
  }

  public setHandler(fn: VoidFunction) {
    this.handler = () => {
      fn();
      this.lastRunAt = new Date();
    };
  }

  public currentTimezone(): string {
    return this.tz;
  }

  public canAutoStart(): boolean {
    return this.autoStart;
  }
}

export class TaskProxy {
  constructor(private readonly task: Task) {}

  public getStatus() {
    this.task.getStatus();
  }

  public kill() {
    this.task.kill();
  }

  public prettyPrint() {
    this.task.prettyPrint();
  }

  public setHandler(fn: VoidFunction) {
    this.task.setHandler(fn);
  }

  public getCronParts() {
    return this.task.getCronParts();
  }

  public start() {
    this.task.start();
  }
}
