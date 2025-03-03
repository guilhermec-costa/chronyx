import { sumStruct } from "./types";

function sum(sumStruct: sumStruct) {
  return sumStruct.a + sumStruct.b;
}

export {
  sum,
}

export * from "./types"
