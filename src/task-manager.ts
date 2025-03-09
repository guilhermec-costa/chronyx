import EventEmitter from "events";
import { Configurator } from "./configurator";
import { CronLogger } from "./logger/logger";
import { Task } from "./task";
import { CronParts, CronType } from "./types";

export type TaskExecutionContainer = Map<
  String,
  {
    mainExecutorId: NodeJS.Timeout;
    debugTickerId?: NodeJS.Timeout;
  }
>;

export class TaskManager {
  /**
   * A storage for task execution configuration, including intervals.
   */
  public taskStorage: Array<Task>;
  public executorStorage: TaskExecutionContainer;
  private readonly configurator: Configurator;
  private readonly logger: CronLogger;
  private readonly eventEmitter: EventEmitter;

  public constructor(configurator: Configurator) {
    this.taskStorage = [];
    this.executorStorage = new Map();
    this.configurator = configurator;
    this.logger = this.configurator.logger;
    this.eventEmitter = new EventEmitter();

    this.eventEmitter.on("kill-task", (taskId) => {
      this.stopTask(taskId);
    });
  }

  public makeTask(
    name: string,
    repr: string,
    handler: () => void,
    type: CronType,
    autoStart?: boolean,
    parts?: CronParts,
    timezone: string = "utc"
  ): Task {
    const t = new Task(
      name,
      repr,
      handler,
      type,
      this.eventEmitter,
      parts,
      autoStart,
      timezone
    );
    this.taskStorage.push(t);
    this.logger.debug(`Task "${t.getId()}" created`);
    return t;
  }

  public addIntervalTask(task: Task) {
    this.taskStorage.push(task);
  }

  public addExecutorConfig(
    t: Task,
    mainExecutorId: NodeJS.Timeout,
    debugTickerExecutorId?: NodeJS.Timeout
  ) {
    this.executorStorage.set(t.getId(), {
      mainExecutorId: mainExecutorId,
      debugTickerId: debugTickerExecutorId,
    });
  }

  public stopTask(tId: string) {
    const tConfig = this.executorStorage.get(tId);
    clearInterval(tConfig?.mainExecutorId);
    if (tConfig?.debugTickerId) {
      clearInterval(tConfig.debugTickerId);
    }
    this.executorStorage.delete(tId);

    this.logger.debug(`Task "${tId}" killed`);
  }
}
