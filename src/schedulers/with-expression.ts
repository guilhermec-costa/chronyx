import { Task, TaskProxy } from "../task";
import { CronParts, TaskArgs } from "../types";
import { getMachineTz, getTzNow } from "../utils";
import { Scheduler } from "./scheduler";

export class WithExpression extends Scheduler {
  public schedule({
    handler,
    repr,
    options: {
      autoStart = true,
      debugTick,
      name = "unknown",
      timeZone = getMachineTz(),
    },
  }: TaskArgs): TaskProxy {
    this.logger.debug(`Scheduling task using Expression method: ${repr}`);
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

    t.setInitFn(() => {
      const i = setInterval(() => {
        const now = getTzNow(t.currentTimezone());
        if (this.patternValidator.matchesCron(now, parsedCron)) {
          t.exec();
        }
      }, this.defineTimeout(t.getCronParts() as CronParts));

      let tickerId;
      if (debugTick) {
        tickerId = this.debugTickerActivator(t, debugTick);
      }

      this.taskManager.addExecutorConfig(t, i, tickerId);
    });

    this.checkAutoStarting(t);
    return new TaskProxy(t);
  }
}
