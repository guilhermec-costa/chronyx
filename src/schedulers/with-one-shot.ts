import { Task } from "../task";
import { TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export class WithOneShot extends Scheduler {
  public static schedule({ handler, name, repr, debugTick }: TaskArgs) {
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
    const i = setInterval(() => {
      if (Date.now() >= moment.getTime() && t.ableToRun()) {
        handler();
        clearInterval(i);
      }
    }, 1000);

    t.setExecutorId(i);
    t.changeState("RUNNING");
    return t;
  }
}
