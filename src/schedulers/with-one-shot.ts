import { Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithOneShot extends Scheduler {
  public static schedule({
    handler,
    repr,
    options: { autoStart, debugTick, name = "unknown" },
  }: TaskArgs) {
    const moment = new Date(repr);
    const isMomentValid = moment.getTime() >= Date.now();
    if (!isMomentValid) {
      throw new Error("Target date should be greater/equal to current date");
    }

    const parsedCron = this.cronValidationProxy(repr as string);
    const t = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "ExpressionBased",
      parsedCron
    );
    if (autoStart) t.resume();
    const i = setInterval(() => {
      if (Date.now() >= moment.getTime() && t.ableToRun()) {
        handler();
        clearInterval(i);
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
