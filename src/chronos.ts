import { PatternValidator } from "./pattern-validator";
import { Task, TaskManager } from "./task-manager";
import { ExecFrequency } from "./types";

export class Chronos {

  private taskManager: TaskManager = new TaskManager();
  private patternValidator: PatternValidator = new PatternValidator();
  
  public (name: string): Task {
    const task = this.taskManager.makeTask(name);
    this.taskManager.addIntervalTask(task);
    return task;
  }

  public listTasks() {
    for(const t of this.taskManager.taskStorage) {
      t.prettyPrint();
    }
  }

  public namedTask(name: string, expr: number | string, handler: () => void) {

  }

  public schedule(expr: number | string, handler: () => void, times?: number) {
    switch(typeof expr) {
      case "string":
        const isValid = this.patternValidator.validate(expr) ; 
        if(!isValid) {
          throw new Error(`Expression "${expr}" is not a valid cron expression`);
        }

      case "number":
        this.execEvery(Number(expr), handler, times);
    }
  }

  public execEvery(freq: number | ExecFrequency, handler: () => void, times?: number) {
    let ofcHandler = handler;
    const task = this.taskManager.makeTask("unknown");
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
    console.log(moment.toTimeString());
    const isMomentValid = moment.getTime() >= Date.now();
    if (!isMomentValid) {
      throw new Error("Target date should be greater/equal to current date");
    }

    setInterval(() => {
      const execAt = moment.getTime();
      if (Date.now() === execAt) {
        handler();
      }
    }, 1);
  }
}
