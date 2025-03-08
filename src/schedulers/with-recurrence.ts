import { CronLogger } from "../logger/logger";
import { DebugTickerExecutor, Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithRecurrence extends Scheduler {
  public schedule({
    handler,
    repr,
    options: { autoStart = true, debugTick, name = "unknown" },
  }: TaskArgs): Task {
    this.logger.debug(`Scheduling task using Recurrence method: ${repr}`);
    const timeout = Number(repr);
    if (timeout < 0) {
      throw new Error("frequency interval must be greater than 0");
    }

    const t: Task = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "IntervalBased",
      autoStart,
      undefined
    );

    this.applyAutoStartConfig(t);
    const i = setInterval(() => {
      if (t.ableToRun()) {
        handler();
        t.updateLastRun(new Date());
      }
    }, timeout);

    let tickerId;
    if (debugTick) {
      tickerId = this.debugTickerActivator(t, debugTick);
    }

    this.taskManager.executorStorage.set(t.getId(), {
      mainExecutorId: i,
      debugTickerId: tickerId,
    });

    return t;
  }
}
