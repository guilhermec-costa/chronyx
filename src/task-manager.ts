import { Configurator } from "./configurator";
import { Task } from "./task";
import { CronParts, CronType } from "./types";

export class TaskManager {
  public taskStorage: Array<Task>;
  private static instance: TaskManager;
  private configurator: Configurator;

  private constructor() {
    this.taskStorage = [];
    this.configurator = Configurator.singleton();
  }

  public static singleton(): TaskManager {
    if (!this.instance) {
      this.instance = new TaskManager();
    }

    return TaskManager.instance;
  }

  public makeTask(
    name: string,
    repr: string,
    handler: () => void,
    type: CronType,
    parts: CronParts,
    executorId?: number
  ): Task {
    const t = new Task(name, repr, handler, type, parts, executorId);
    this.taskStorage.push(t);
    if (this.configurator.configs.logger?.level == "debug") {
      console.debug("Task created");
    }
    return t;
  }

  public addIntervalTask(task: Task) {
    this.taskStorage.push(task);
  }
}
