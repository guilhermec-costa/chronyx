export class TaskManager {
  private intervalTasksStorage: Array<IntervalTask>

  constructor() {
    this.intervalTasksStorage = [];
  }

  public makeTask(): IntervalTask {
    return new IntervalTask();

  }

  public addIntervalTask(task: IntervalTask) {
    this.intervalTasksStorage.push(task);
  }
}

export class IntervalTask {
  private execTimes: number;
  public readonly execId: number;

  constructor() {
    this.execTimes = 0;
    this.execId = 1;
  }

  public incrExecTimes() {
    this.execTimes++;
  }

  public getExecTimes() {
    return this.execTimes;
  }
}
