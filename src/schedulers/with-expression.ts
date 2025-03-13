import { Task, TaskProxy } from "../task";
import { TaskArgs } from "../types";
import { getTzNow } from "../utils";
import { Scheduler } from "./scheduler";

export class WithExpression extends Scheduler {
  public schedule({
    handler,
    repr,
    options: { autoStart, debugTick, name = "unknown", timeZone = "utc" },
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

    this.applyAutoStartConfig(t);
    const i = setInterval(() => {
      const now = getTzNow(t.currentTimezone());
      if (this.patternValidator.matchesCron(now, parsedCron)) {
        t.exec();
      }
    }, 1000);

    let tickerId;
    if (debugTick) {
      tickerId = this.debugTickerActivator(t, debugTick);
    }

    this.taskManager.addExecutorConfig(t, i, tickerId);
    return new TaskProxy(t);
  }
}
