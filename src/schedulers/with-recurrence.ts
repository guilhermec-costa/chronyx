import { TaskProxy } from "../task";
import { Scheduler } from "./scheduler";

export type RecurrenceOptions = {
  name?: string;
  debugTick?: VoidFunction;
  autoStart?: boolean;
};
export type RecurrenceSchedulerArgs = {
  handler: VoidFunction;
  timeout: number;
  options: RecurrenceOptions;
};

export const DefaultRecurrenceOptions: RecurrenceOptions = {
  name: "unknown",
  autoStart: true,
};

export class WithRecurrence extends Scheduler {
  public schedule({
    handler,
    timeout,
    options: {
      autoStart = DefaultRecurrenceOptions.autoStart,
      debugTick,
      name = "unknown",
    },
  }: RecurrenceSchedulerArgs): TaskProxy {
    this.logger.debug(`Scheduling task using Recurrence method: ${timeout}`);
    if (timeout < 0) {
      throw new Error("frequency interval must be greater than 0");
    }

    const t = this.taskManager.makeTask(
      name,
      timeout.toString(),
      handler,
      "IntervalBased",
      autoStart,
      undefined,
      undefined
    );

    t.setInitFn(() => {
      const i = setInterval(() => {
        t.exec();
      }, timeout);

      let tickerId;
      if (debugTick) tickerId = this.debugTickerActivator(t, debugTick);
      this.taskManager.addExecutorConfig(t, i, tickerId);
    });

    this.checkAutoStarting(t);
    return new TaskProxy(t);
  }
}
