import { Chronos } from "./chronos";

export * from "./types"
export { Chronos } from "./chronos"
export const chronos = new Chronos();

const c = new Chronos();
const t1 = c.schedule(5000,
  () => {
  console.log("Executing test 1");
});

const t2 = c.schedule(2000, () => {
  console.log("Executing test 2");
});


const expr1 = "* * * * *";
const expr2 = "*/5 0 1 1 *";
const expr3 = "5 */5 0 1 1 *";
/* console.log(c.validateExpr(expr1)); */
/* console.log(c.validateExpr(expr2)); */
/* console.log(c.parseExpr(expr1)); */
/* console.log(c.parseExpr(expr2)); */
/* console.log(c.parseExpr(expr3)); */
console.log(c.expandedValues(expr3));
/* let nowPlusSeconds = new Date(); */
/* nowPlusSeconds.setSeconds(nowPlusSeconds.getSeconds() + 10); */
/* c.oneShot(nowPlusSeconds, () => console.log("eee")); */
