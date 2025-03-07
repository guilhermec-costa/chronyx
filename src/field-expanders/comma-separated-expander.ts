export class CommaSeparatedFieldExpander implements FieldExpander {
  public expand(
    field: string,
    lowerLimit: number,
    upperLimit: number
  ): number[] {
    return field.split(",").map(Number);
  }
}
