import { Scheduler } from "./schedulers/scheduler";
import { CronParts, CronType } from "./types";

export type TaskStatus = "CREATED" | "RUNNING" | "KILLED" | "PAUSED";

class DebugTickerExecutor {
  constructor(
    public readonly executorId: number,
    public readonly cb: VoidFunction
  ) {}
}
export class Task {
  private executorId: number | null;
  public name: string;
  public repr: string;
  public handler: () => void;
  private cronType: CronType;
  private status: TaskStatus;
  public cronParts: CronParts;
  private timeZone: string;
  private debugTicker?: DebugTickerExecutor;

  constructor(
    name: string,
    repr: string,
    handler: () => void,
    cronType: CronType,
    cronParts: CronParts,
    timeZone: string = "UTC",
    executorId?: number,
    debugerTicker?: DebugTickerExecutor
  ) {
    if (executorId) this.executorId = executorId;
    else this.executorId = 0;
    this.name = name;
    this.repr = repr;
    this.handler = handler;
    this.cronType = cronType;
    this.status = "CREATED";
    this.cronParts = cronParts;
    this.timeZone = timeZone;
  }

  public setExecutorId(id: number) {
    this.executorId = id;
  }

  public prettyPrint() {
    console.log(
      `Name: ${this.name}\nType:${
        this.cronType
      }\nHandler:${this.handler.toString()}\nExecutorId:${
        this.executorId
      }\nStatus:${this.status}`
    );
  }

  public changeState(s: TaskStatus) {
    if (this.status != s) {
      this.status = s;
    }
  }

  public pause() {
    this.status = "PAUSED";
  }

  public ableToRun() {
    return this.status !== "PAUSED" && this.status !== "KILLED";
  }

  public stop() {
    if (this.executorId) {
      clearInterval(this.executorId);
    }

    this.status = "KILLED";
    this.executorId = null;
  }
}
