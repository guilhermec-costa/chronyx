import { Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithOneShot extends Scheduler {
  public static schedule({
    handler,
    repr,
    options: { autoStart, debugTick, name },
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
      parsedCron,
      0
    );
    if (autoStart) t.resume();
    const i = setInterval(() => {
      if (Date.now() >= moment.getTime() && t.ableToRun()) {
        handler();
        clearInterval(i);
      }
    }, 1000);

    if (debugTick) this.debugTickerActivationProxy(t, debugTick);
    t.setExecutorId(i);
    return t;
  }
}
