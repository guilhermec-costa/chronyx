import { DebugTickerExecutor, Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithRecurrence extends Scheduler {
  static schedule({
    handler,
    repr,
    options: { autoStart, debugTick, name = "unknown" },
  }: TaskArgs): Task {
    const timeout = Number(repr);
    const parsedCron = this.cronValidationProxy(repr.toString());
    if (timeout < 0) {
      throw new Error("frequency interval must be greater than 0");
    }

    const t: Task = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "IntervalBased",
      parsedCron,
      0
    );

    if (autoStart) t.resume();
    const i = setInterval(() => {
      if (t.ableToRun()) {
        handler();
      }
    }, timeout);

    if (debugTick) this.debugTickerActivationProxy(t, debugTick);
    t.setExecutorId(i);
    return t;
  }
}
