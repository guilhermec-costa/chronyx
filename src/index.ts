import { ExecFrequency, IntervalTask } from "./types";

export * from "./types"

class TaskManager {
  private intervalRunningTasks: Array<IntervalTask>
  
  constructor() {
    this.intervalRunningTasks = [];
  }

  public makeTask(): IntervalTask {
    return new IntervalTask();
    
  }

  protected addIntervalTask(task: IntervalTask) {
    this.intervalRunningTasks.push(task);
  }

  protected getTask(id: string) {
    return this.intervalRunningTasks.find((t) => t.id === id);
  }
}

export class Chronos extends TaskManager {
  
  constructor() {
    super();
  }

  public execEvery(freq: number | ExecFrequency, handler: () => void, times?: number) {
    let ofcHandler = handler;
    const task = this.makeTask(); 
    this.addIntervalTask(task);

    if(freq < 0) {
      console.error("frequency interval must be greater than 0");
      return;
    }

    if(times) {
      ofcHandler = async () => {
        if(task.getExecTimes() <= times) {
          await handler();
          task.incrExecTimes();
          return;
        }
      }
    }

    setInterval(ofcHandler, freq);
  }
}

/* chronos.execEvery(5000, () => { */
/*   console.log("Executing chron"); */
/* }) */

