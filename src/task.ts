import { TaskManager } from "./task-manager";
import { CronParts, CronType } from "./types";
import { v4 as uuidv4, v4 } from "uuid";
import EventEmitter from "events";

export type TaskStatus = "CREATED" | "RUNNING" | "KILLED" | "PAUSED";

export class DebugTickerExecutor {
  constructor(
    public readonly executorId: number,
    public readonly cb: VoidFunction
  ) {}
}
export class Task {
  private readonly id: string;
  public name: string;
  public expression: string;
  public handler: () => void;
  private cronType: CronType;
  private status: TaskStatus;
  public cronParts?: CronParts;
  public autoStart: boolean;
  private lastRunAt?: Date;
  private emitter: EventEmitter;

  constructor(
    name: string,
    expression: string,
    handler: () => void,
    cronType: CronType,
    emitter: EventEmitter,
    cronParts?: CronParts,
    autoStart: boolean = true
  ) {
    this.id = uuidv4();
    this.name = name;
    this.expression = expression;
    this.handler = handler;
    this.cronType = cronType;
    this.status = "CREATED";
    this.cronParts = cronParts;
    this.autoStart = autoStart;
    this.emitter = emitter;
  }

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
Handler: ${this.handler.toString()}
AutoStart: ${this.autoStart}
LastRun: ${this.lastRunAt}`
    );
  }

  public resume() {
    this.status = "RUNNING";
  }

  public pause() {
    this.status = "PAUSED";
  }

  public ableToRun() {
    return (
      this.status !== "PAUSED" &&
      this.status !== "KILLED" &&
      this.status !== "CREATED"
    );
  }

  public stop() {
    this.emitter.emit("kill-task", this.getId());
    this.status = "KILLED";
  }

  public getId() {
    return this.id;
  }

  public updateLastRun(date: Date) {
    this.lastRunAt = date;
  }
}
