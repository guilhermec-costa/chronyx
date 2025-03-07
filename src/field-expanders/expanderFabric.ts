import { AsteriskFieldExpander } from "./asterisk-expander";
import { CommaSeparatedFieldExpander } from "./comma-separated-expander";
import { IncrementalFieldExpander } from "./incremental-expander";
import { RangeFieldExpander } from "./range-expander";

export class ExpanderFabric {
  public static getExpander(
    field: string,
    lowerLimit: number,
    upperLimit: number
  ): FieldExpander | undefined {
    if (field === "*") return new AsteriskFieldExpander();
    if (field.includes("*/")) return new IncrementalFieldExpander();
    if (field.includes("-")) return new RangeFieldExpander();
    if (field.includes(",")) return new CommaSeparatedFieldExpander();
    return undefined;
  }
}
