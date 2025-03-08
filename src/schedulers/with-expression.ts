import { Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithExpression extends Scheduler {
  public schedule({
    handler,
    repr,
    options: { autoStart, debugTick, name = "unknown" },
  }: TaskArgs): Task {
    this.configurator.logger.debug(
      `Scheduling task using Expression method: ${repr}`
    );
    const parsedCron = this.cronValidationProxy(repr as string);
    const t = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "ExpressionBased",
      autoStart,
      parsedCron
    );

    this.applyAutoStartConfig(t);
    const i = setInterval(() => {
      const now = new Date();
      if (this.matchesCron(now, parsedCron) && t.ableToRun()) {
        handler();
        t.updateLastRun(new Date());
      }
    }, 1000);

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
