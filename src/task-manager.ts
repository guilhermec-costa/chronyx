import { CronType } from "./types";

export class TaskManager {
  public taskStorage: Array<Task>;

  constructor() {
    this.taskStorage = [];
  }

  public makeTask(
    name: string,
    repr: string,
    handler: () => void,
    type: CronType,
    executorId?: number
  ): Task {
    return new Task(name, repr, handler, type, executorId);
  }

  public addIntervalTask(task: Task) {
    this.taskStorage.push(task);
  }
}

export class Task {
  private execTimes: number;
  public executorId: number;
  public name: string;
  public scheduleRepr: number | string;
  public handler: () => void;
  public cronType: CronType;
  public status: string;

  constructor(
    name: string,
    repr: string,
    handler: () => void,
    cronType: CronType,
    executorId?: number
  ) {
    this.execTimes = 0;
    if (executorId) this.executorId = executorId;
    else this.executorId = 0;
    this.name = name;
    this.scheduleRepr = repr;
    this.handler = handler;
    this.cronType = cronType;
    this.status = "RUNNING";
  }

  public setExecutorId(id: number) {
    this.executorId = id;
  }

  public incrExecTimes() {
    this.execTimes++;
  }

  public getExecTimes() {
    return this.execTimes;
  }

  public prettyPrint() {
    console.log(
      `Name: ${this.name}\nType:${
        this.cronType
      }\nHandler:${this.handler.toString()}\nExecutorId:${
        this.executorId
      }\nExecutedTimes: ${this.execTimes}\nStatus:${this.status}`
    );
  }

  public stop() {
    clearInterval(this.executorId);
    this.status = "KILLED";
  }
}
