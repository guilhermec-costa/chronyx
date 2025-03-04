import { Chronos } from "./chronos";

export * from "./types"
export { Chronos } from "./chronos"

const c = new Chronos();
c.execEvery(5000, () => {
  console.log("Executing chron c1");
});

c.oneShot(new Date(2025, 3, 4, 11, 40, 0), () => console.log("eee"));
