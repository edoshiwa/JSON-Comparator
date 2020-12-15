import { randomString } from "./Bench";
/**
 * Person class only used for benchmark purpose
 */
export default class Person {
  /**
   * Constructor of the Person, no argument are needed
   * because every property are random.
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
   * Add a string dynamicly to the Person.
   * @param {*} str string to add to the Person.
   */
  addString(str) {
    this.str = str;
  }
}
