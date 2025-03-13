import { TaskProxy } from "../task";
import { CronParts, TaskArgs } from "../types";
import { getTzNow } from "../utils";
import { Scheduler } from "./scheduler";

export class WithOneShot extends Scheduler {
  public schedule({
    handler,
    repr,
    options: { autoStart, debugTick, name = "unknown", timeZone = "utc" },
  }: TaskArgs): TaskProxy {
    this.logger.debug(`Scheduling task using One Shot method: ${repr}`);
    const moment = new Date(repr);
    const isMomentValid = moment.getTime() >= Date.now();
    if (!isMomentValid) {
      throw new Error("Target date should be greater/equal to current date");
    }

    const parsedCron = this.patternValidator.getCronPartsIfValid(
      repr as string
    );
    const t = this.taskManager.makeTask(
      name,
      repr,
      handler,
      "ExpressionBased",
      autoStart,
      parsedCron,
      timeZone
    );
    this.applyAutoStartConfig(t);
    const i = setInterval(() => {
      const now = getTzNow(t.currentTimezone());
      if (Date.now() >= moment.getTime()) {
        t.exec();
        clearInterval(i);
      }
    }, this.defineTimeout(t.getCronParts() as CronParts));

    let tickerId;
    if (debugTick) {
      tickerId = this.debugTickerActivator(t, debugTick);
    }
    this.taskManager.addExecutorConfig(t, i, tickerId);
    return new TaskProxy(t);
  }
}
