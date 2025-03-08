import { Configurator } from "./configurator";
import { Task } from "./task";
import { CronParts, CronType } from "./types";

export type TaskExecutionContainer = Map<
  String,
  {
    mainExecutorId: number;
    debugTickerId?: number;
  }
>;

export class TaskManager {
  public taskStorage: Array<Task>;
  public executorStorage: TaskExecutionContainer;
  private static instance: TaskManager;
  private configurator: Configurator;

  private constructor() {
    this.taskStorage = [];
    this.executorStorage = new Map();
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
    autoStart?: boolean,
    parts?: CronParts
  ): Task {
    const t = new Task(name, repr, handler, type, parts, autoStart);
    this.taskStorage.push(t);
    return t;
  }

  public addIntervalTask(task: Task) {
    this.taskStorage.push(task);
  }

  public addExecutorConfig(
    t: Task,
    mainExecutorId: number,
    debugTickerExecutorId?: number
  ) {
    this.executorStorage.set(t.getId(), {
      mainExecutorId: mainExecutorId,
      debugTickerId: debugTickerExecutorId,
    });
  }

  public stopTask(tId: string) {
    const tConfig = this.executorStorage.get(tId);
    console.log("Task config: ", tConfig);
    clearInterval(tConfig?.mainExecutorId);
    if (tConfig?.debugTickerId) {
      clearInterval(tConfig.debugTickerId);
    }
    this.executorStorage.delete(tId);
  }
}
