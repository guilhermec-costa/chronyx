import { Chronos } from "./chronos";

export * from "./types"
export { Chronos } from "./chronos"
export const chronos = new Chronos();

const c = new Chronos();
/* c.execEvery(5000, () => { */
/*   console.log("Executing chron c1"); */
/* }); */

const t1 = c.schedule(5000,
  () => {
  console.log("Executing test 1");
})
const t2 = c.schedule(2000, () => {
  console.log("Executing test 2");
})

c.listTasks();
/* let nowPlusSeconds = new Date(); */
/* nowPlusSeconds.setSeconds(nowPlusSeconds.getSeconds() + 10); */
/* c.oneShot(nowPlusSeconds, () => console.log("eee")); */
