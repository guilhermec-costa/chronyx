export class IncrementalFieldExpander implements FieldExpander {
  public expand(
    field: string,
    lowerLimit: number,
    upperLimit: number
  ): number[] {
    const step = +field.split("*/")[1];
    return Array.from(
      { length: Math.floor((upperLimit - lowerLimit + 1) / step) },
      (_, i) => lowerLimit + i * step
    );
  }
}
