import { TaskProxy } from "../task";
import { Scheduler } from "./scheduler";

export type TimeoutOptions = {
  name?: string;
  debugTick?: VoidFunction;
};
export type TimeoutSchedulerArgs = {
  handler: VoidFunction;
  timeout: number;
  options: TimeoutOptions;
};

export const DefaultTimeoutOptions: TimeoutOptions = {
  name: "unknown",
};

export class WithTimeout extends Scheduler {
  public schedule({
    handler,
    timeout,
    options: { debugTick, name = "unknown" },
  }: TimeoutSchedulerArgs): TaskProxy {
    this.logger.debug(`Scheduling task using Timeout method: ${timeout}`);

    const t = this.taskManager.makeTask(
      name,
      timeout.toString(),
      handler,
      "TimeoutBased",
      true,
      undefined
    );

    let tickerId: NodeJS.Timeout | undefined;
    if (debugTick) tickerId = this.debugTickerActivator(t, debugTick);

    t.setInitFn(() => {
      const i = setTimeout(() => {
        t.exec();
        this.taskManager.emitKillEvent(t.getId());
      }, timeout);

      this.taskManager.addExecutorConfig(t, i, tickerId);
    });

    this.checkAutoStarting(t);
    return new TaskProxy(t);
  }
}
