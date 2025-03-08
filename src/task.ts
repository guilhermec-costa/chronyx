import { TaskManager } from "./task-manager";
import { CronParts, CronType } from "./types";
import { v4 as uuidv4, v4 } from "uuid";

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
  public repr: string;
  public handler: () => void;
  private cronType: CronType;
  private status: TaskStatus;
  public cronParts?: CronParts;

  constructor(
    name: string,
    repr: string,
    handler: () => void,
    cronType: CronType,
    cronParts?: CronParts
  ) {
    this.id = uuidv4();
    this.name = name;
    this.repr = repr;
    this.handler = handler;
    this.cronType = cronType;
    this.status = "CREATED";
    this.cronParts = cronParts;
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
Expression: ${this.repr}
Handler: ${this.handler.toString()}`
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
    TaskManager.singleton().stopTask(this.getId());
    this.status = "KILLED";
  }

  public getId() {
    return this.id;
  }
}
