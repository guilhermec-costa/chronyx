import { ExpanderFabric } from "./field-expanders/expanderFabric";
import { CRON_LIMITS, CronParts } from "./types";
import { dateComponents } from "./utils";

/**
 * Validates and parses cron expressions.
 *
 * This class provides methods to parse cron expressions, validate their correctness,
 * expand cron fields to their respective values, and check if a given date matches a cron expression.
 */
export class PatternValidator {
  /**
   * Constructs a new instance of PatternValidator.
   */
  public constructor() {}

  /**
   * Parses a cron expression into its components.
   *
   * @param expr - The cron expression to parse.
   * @returns An object representing the parsed cron parts (second, minute, hour, dayOfMonth, month, dayOfWeek).
   * @throws Error if the cron expression does not contain 5 or 6 fields.
   */
  public parseExpr(expr: string): CronParts {
    const exprParts = expr.trim().split(/\s+/);
    const exprLen = exprParts.length;
    if (exprLen < 5 || exprLen > 6) {
      throw new Error("Cron expression should have 5 or 6 fields");
    }

    let second, minute, hour, dayOfMonth, month, dayOfWeek;
    if (exprLen === 5) {
      [second, minute, hour, dayOfMonth, month, dayOfWeek] = [
        "0",
        ...exprParts,
      ];
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
    };
  }

  /**
   * Expands a cron field to its numeric values.
   *
   * @param field - The cron field to expand.
   * @param lowerLimit - The minimum allowed value for the field.
   * @param upperLimit - The maximum allowed value for the field.
   * @returns An array of numbers representing the expanded values.
   */
  public expandField(
    field: string,
    lowerLimit: number,
    upperLimit: number
  ): number[] {
    const expander = ExpanderFabric.getExpander(field, lowerLimit, upperLimit);
    if (!expander) return [Number(field)];
    return expander.expand(field, lowerLimit, upperLimit);
  }

  /**
   * Validates whether a cron field is within the allowed range.
   *
   * @param field - The cron field to validate.
   * @param min - The minimum allowed value.
   * @param max - The maximum allowed value.
   * @returns True if the field is valid, false otherwise.
   */
  public validateField(field: string, min: number, max: number) {
    const values = this.expandField(field, min, max);
    return values.every((v) => v >= min && v <= max);
  }

  /**
   * Validates a cron expression by checking if all fields are within valid ranges.
   *
   * @param cron - The parsed cron parts to validate.
   * @returns True if the cron expression is valid, false otherwise.
   */
  public validateCron(cron: CronParts) {
    return (
      (cron.second
        ? this.validateField(
            cron.second,
            CRON_LIMITS.second[0],
            CRON_LIMITS.second[1]
          )
        : true) &&
      this.validateField(
        cron.minute,
        CRON_LIMITS.minute[0],
        CRON_LIMITS.minute[1]
      ) &&
      this.validateField(cron.hour, CRON_LIMITS.hour[0], CRON_LIMITS.hour[1]) &&
      this.validateField(
        cron.dayOfMonth,
        CRON_LIMITS.dayOfMonth[0],
        CRON_LIMITS.dayOfMonth[1]
      ) &&
      this.validateField(
        cron.month,
        CRON_LIMITS.month[0],
        CRON_LIMITS.month[1]
      ) &&
      this.validateField(
        cron.dayOfWeek,
        CRON_LIMITS.dayOfWeek[0],
        CRON_LIMITS.dayOfWeek[1]
      )
    );
  }

  /**
   * Checks whether a given date matches a cron expression.
   *
   * @param moment - The date to check against the cron expression.
   * @param cron - The parsed cron parts to match.
   * @returns True if the date matches the cron expression, false otherwise.
   */
  public matchesCron(moment: Date, cron: CronParts) {
    const { dayOfMonth, dayOfWeek, hour, minute, month, second } =
      dateComponents(moment);

    return (
      this.expandField(
        cron.second,
        CRON_LIMITS.second[0],
        CRON_LIMITS.second[1]
      ).includes(second) &&
      this.expandField(
        cron.minute,
        CRON_LIMITS.minute[0],
        CRON_LIMITS.minute[1]
      ).includes(minute) &&
      this.expandField(
        cron.hour,
        CRON_LIMITS.hour[0],
        CRON_LIMITS.hour[1]
      ).includes(hour) &&
      this.expandField(
        cron.dayOfMonth,
        CRON_LIMITS.dayOfMonth[0],
        CRON_LIMITS.dayOfMonth[1]
      ).includes(dayOfMonth) &&
      this.expandField(
        cron.month,
        CRON_LIMITS.month[0],
        CRON_LIMITS.month[1]
      ).includes(month) &&
      this.expandField(
        cron.dayOfWeek,
        CRON_LIMITS.dayOfWeek[0],
        CRON_LIMITS.dayOfWeek[1]
      ).includes(dayOfWeek)
    );
  }
}
