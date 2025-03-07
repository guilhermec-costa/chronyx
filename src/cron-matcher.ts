import { CRON_LIMITS, CronParts } from "./types";

export class CronMatcher {
  private static instance: CronMatcher;

  private constructor() {}

  public static singleton(): CronMatcher {
    if (!this.instance) {
      this.instance = new CronMatcher();
    }

    return CronMatcher.instance;
  }
}
