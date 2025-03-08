import { DebugTickerExecutor, Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithRecurrence extends Scheduler {
  static schedule({
    handler,
    repr,
    options: { autoStart = true, debugTick, name = "unknown" },
  }: TaskArgs): Task {
    const timeout = Number(repr);
    if (timeout < 0) {
      throw new Error("frequency interval must be greater than 0");
    }

    const t: Task = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "IntervalBased",
      undefined
    );

    if (autoStart) t.resume();
    const i = setInterval(() => {
      if (t.ableToRun()) {
        handler();
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
