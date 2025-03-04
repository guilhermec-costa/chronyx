import { TaskManager } from "./task-manager";
import { ExecFrequency } from "./types";

export class Chronos {

  private taskManager: TaskManager = new TaskManager();

  public execEvery(freq: number | ExecFrequency, handler: () => void, times?: number) {
    let ofcHandler = handler;
    const task = this.taskManager.makeTask();
    this.taskManager.addIntervalTask(task);

    if (freq < 0) {
      throw new Error("frequency interval must be greater than 0");
    }

    if (times) {
      ofcHandler = async () => {
        if (task.getExecTimes() < times) {
          Promise.resolve(handler())
            .then(task.incrExecTimes);
          return;
        }
      }
    }

    setInterval(ofcHandler, freq);
  }

  public oneShot(moment: Date, handler: () => void) {
    const isMomentValid = moment.getTime() >= Date.now();
    if (!isMomentValid) {
      throw new Error("Target date should be greater/equal to current date");
    }

    setInterval(() => {
      const execAt = moment.getTime();
      if (Date.now() >= execAt) {
        handler();
      }
    }, 1000);
  }
}
