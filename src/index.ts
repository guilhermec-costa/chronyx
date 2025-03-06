import { Chronos } from "./chronos";

export * from "./types";
export { Chronos } from "./chronos";
export const chronos = new Chronos();

const c = new Chronos();
const expr = "* * * * * *";

const task = c.schedule(expr, () => {
  console.log("Hello world");
});

task.prettyPrint();
