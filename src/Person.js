import { randomString } from "./Bench";
/**
 *
 */
export default class Person {
  /**
   *
   */
  constructor() {
    this.addString = this.addString.bind(this);
    const tab = new Int16Array(4);
    window.crypto.getRandomValues(tab);
    this.age = Math.abs(tab[0]) % 120;
    this.city = randomString(14);
    this.firstName = randomString(14);
    this.lastName = randomString(14);
    this.height = 50 + Math.abs(tab[1] % 200);
    this.sex = tab[2] % 2 === 0;
    this.zipcode = 10000 + (Math.abs(tab[3]) % 89999);
    this.str;
  }
  /**
   *
   * @param {*} str
   */
  addString(str) {
    this.str = str;
  }
}
