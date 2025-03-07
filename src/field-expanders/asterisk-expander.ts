export class AsteriskFieldExpander implements FieldExpander {
  public expand(
    field: string,
    lowerLimit: number,
    upperLimit: number
  ): number[] {
    return Array.from(
      { length: upperLimit - lowerLimit + 1 },
      (_, i) => i + lowerLimit
    );
  }
}
