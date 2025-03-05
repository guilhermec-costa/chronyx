export class TaskManager {
  public taskStorage: Array<Task>

  constructor() {
    this.taskStorage = [];
  }

  public makeTask(
    name: string,
    repr: string,
    executorId?: number
  ): Task {
    return new Task(name, repr, executorId);
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

  constructor(name: string, repr: string, executorId?: number) {
    this.execTimes = 0;
    if(executorId) this.executorId = executorId;
    else this.executorId = 0;
    this.name = name;
    this.scheduleRepr = repr;
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
    console.log(`name: ${this.name}\nexecutedTimes: ${this.execTimes}`);
  }

  public stop() {
    clearInterval(this.executorId);
  }
}
