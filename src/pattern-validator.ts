import { CronParts } from "./types";

export class PatternValidator {

  private cronRegex = /^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?) ?){5,7})$|(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)/

  public validateExpr(expr: string): boolean {
    return this.cronRegex.test(expr);
  }

  public parseExpr(expr: string): CronParts {
    const exprParts = expr.trim().split(/\s+/);
    const exprLen = exprParts.length;
    if (exprLen < 5 || exprLen > 6) {
      throw new Error("Cron expression should have 5 or 6 fields");
    }

    let second, minute, hour, dayOfMonth, month, dayOfWeek;
    if (exprLen === 5) {
      [minute, hour, dayOfMonth, month, dayOfWeek] = exprParts;
    } else {
      [second, minute, hour, dayOfMonth, month, dayOfWeek] = exprParts;
    }

    return {
      second,
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
    }
  }

  public expandField(field: string, lowerLimit: number, upperLimit: number): number[] {
    if (field === "*") return Array.from({ length: upperLimit - lowerLimit + 1 }, (_, i) => i + lowerLimit);

    if (field.includes("/*")) {
      const step = +(field.split("/*")[1]);
      return Array.from({ length: Math.floor((upperLimit - lowerLimit + 1) / step) }, (_, i) => lowerLimit + i * step);
    }

    if (field.includes("-")) {
      return field.split("-").map(Number);
    }

    if (field.includes(',')) {
      return field.split(",").map(Number);
    }

    return [Number(field)];
  }

  public matchesCron(moment: Date, expr: string) {

  }
}
