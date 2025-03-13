import { Task, TaskProxy } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithRecurrence extends Scheduler {
  public schedule({
    handler,
    repr,
    options: {
      autoStart = true,
      debugTick,
      name = "unknown",
      timeZone = "utc",
    },
  }: TaskArgs): TaskProxy {
    this.logger.debug(`Scheduling task using Recurrence method: ${repr}`);
    const timeout = Number(repr);
    if (timeout < 0) {
      throw new Error("frequency interval must be greater than 0");
    }

    const t = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "IntervalBased",
      autoStart,
      undefined,
      timeZone
    );

    this.applyAutoStartConfig(t);
    const i = setInterval(() => {
      t.exec();
    }, timeout);

    let tickerId;
    if (debugTick) {
      tickerId = this.debugTickerActivator(t, debugTick);
    }

    this.taskManager.addExecutorConfig(t, i, tickerId);
    return new TaskProxy(t);
  }
}
