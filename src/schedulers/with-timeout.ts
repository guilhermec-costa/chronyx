import { TaskProxy } from "../task";
import { SchedulingOptions, TaskArgs } from "../types";
import { Scheduler } from "./scheduler";

export type TimeoutSchedulerArgs = {
  handler: VoidFunction;
  timeout: number;
  options: SchedulingOptions;
};

export class WithTimeout extends Scheduler {
  public schedule({
    handler,
    timeout,
    options: { autoStart, debugTick, name = "unknown", timeZone = "utc" },
  }: TimeoutSchedulerArgs): TaskProxy {
    this.logger.debug(`Scheduling task using Timeout method: ${timeout}`);

    const t = this.taskManager.makeTask(
      name,
      timeout.toString(),
      handler,
      "TimeoutBased",
      autoStart,
      undefined,
      timeZone
    );
    this.applyAutoStartConfig(t);
    const i = setTimeout(() => {
      t.exec();
      clearTimeout(i);
    }, timeout);

    let tickerId;
    if (debugTick) {
      tickerId = this.debugTickerActivator(t, debugTick);
    }
    this.taskManager.addExecutorConfig(t, i, tickerId);
    return new TaskProxy(t);
  }
}
