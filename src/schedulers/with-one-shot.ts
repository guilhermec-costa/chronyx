import { TaskProxy } from "../task";
import { CronParts } from "../types";
import { getMachineTz, getTzNow } from "../utils";
import { Scheduler } from "./scheduler";

export type OneShotOptions = {
  name?: string;
  debugTick?: VoidFunction;
  timeZone?: string;
  autoStart?: boolean;
};
export type OneShotSchedulerArgs = {
  handler: VoidFunction;
  moment: Date;
  options: OneShotOptions;
};

export const DefaultOneShotOptions: OneShotOptions = {
  name: "unknown",
  timeZone: getMachineTz(),
  autoStart: true,
};

export class WithOneShot extends Scheduler {
  public schedule({
    handler,
    moment,
    options: {
      debugTick,
      name = "unknown",
      timeZone = DefaultOneShotOptions.timeZone,
      autoStart = DefaultOneShotOptions.autoStart,
    },
  }: OneShotSchedulerArgs): TaskProxy {
    this.logger.debug(
      `Scheduling task using One Shot method: ${moment.toString()}`
    );
    const isMomentValid = moment.getTime() >= Date.now();
    if (!isMomentValid) {
      throw new Error("Target date should be greater/equal to current date");
    }

    const t = this.taskManager.makeTask(
      name,
      moment.toISOString(),
      handler,
      "ExpressionBased",
      autoStart,
      undefined,
      timeZone
    );

    t.setInitFn(() => {
      let tickerId = undefined;
      if (debugTick) tickerId = this.debugTickerActivator(t, debugTick);

      const i = setInterval(() => {
        const now = getTzNow(t.currentTimezone());
        if (Date.now() >= moment.getTime()) {
          t.exec();
          this.taskManager.emitKillEvent(t.getId());
        }
      }, 1000);

      this.taskManager.addExecutorConfig(t, i, tickerId);
    });

    this.checkAutoStarting(t);
    return new TaskProxy(t);
  }
}
