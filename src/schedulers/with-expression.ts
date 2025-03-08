import { DebugTickerExecutor, Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithExpression extends Scheduler {
  public static schedule({
    handler,
    name,
    repr,
    debugTick,
    autoStart,
  }: TaskArgs): Task {
    const parsedCron = this.cronValidationProxy(repr as string);
    const t = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "ExpressionBased",
      parsedCron,
      0
    );

    const i = setInterval(() => {
      const now = new Date();
      if (this.matchesCron(now, parsedCron) && t.ableToRun()) {
        handler();
      }
    }, 1000);

    if (debugTick) this.debugTickerActivationProxy(t, debugTick);
    t.setExecutorId(i);
    t.resume();
    return t;
  }
}
