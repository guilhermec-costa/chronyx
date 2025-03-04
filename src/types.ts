export class IntervalTask {
  public readonly id: string;
  private execTimes: number;
  public readonly intervalId: number;

  constructor(id?: string) {
    if(!id) {
      this.id = Date.now().toString();
    } else {
      this.id = id;
    }

    this.execTimes = 0;
    this.intervalId = 0;
  }

  public incrExecTimes() {
    this.execTimes++;
  }

  public getExecTimes() {
    return this.execTimes;
  }
}

export enum ExecFrequency {
  EVERY_5_MINUTES = 5 * 60 * 1000
}

