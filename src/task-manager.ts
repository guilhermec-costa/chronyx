export class TaskManager {
  public taskStorage: Array<Task>

  constructor() {
    this.taskStorage = [];
  }

  public makeTask(
    name?: string
  ): Task {
    return new Task(name);
  }

  public addIntervalTask(task: Task) {
    this.taskStorage.push(task);
  }
}

export class Task {
  private execTimes: number;
  public readonly execId: number;
  public name: string;
  public scheduleRepr: number | string;

  constructor(name?: string, repr: number | string) {
    this.execTimes = 0;
    this.execId = 1;
    if (!name) {
      this.name = "unknown";
    } else {
      this.name = name;
    }
    this.scheduleRepr = repr;
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
}
