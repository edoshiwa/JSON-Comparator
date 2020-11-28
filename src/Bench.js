/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

const Number = {
  ONE_MILLION: 1000000,
  ONE_HUNDRED_THOUSAND: 100000,
  FIVE_HUNDRED_THOUSAND: 500000,
  RANDOM_STRING_LENGTH: 14,
};
export const Description = {
  b_arr_str_low:
    "Creating array of 100 000 random strings that are 14 chars long",
  b_arr_str_high:
    "Creating array of 1 000 000 random strings that are 14 chars long",
  b_arr_int_for: "Creating array of 1 000 000 random int with a for loop",
  b_arr_int_fill: "Creating array of 1 000 000 identical int with array fill",
  /* b_asso_array:
    "Creating associative array of 500 000 int with key strings that are 14 chars long",
  b_obj:
    "Creating 100 000 objects with 7 properties (3 Strings that are 14 chars long and int) and dynamically add one string property to each that are 14 chars long",
  b_search_dict:
    "Creating associative array of 500 000 int with key strings that are 14 chars long and searching each one and sending back an array of every value",
    */
};
/**
 *
 * @param {*} length
 * @return {*} random string from alplanumeric chars of length char
 */
function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  const strongRng = new Int32Array(length);
  window.crypto.getRandomValues(strongRng);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.abs(strongRng[i]) % charactersLength);
  }
  return result;
}

/**
 * "Creating array of 1 000 000 identical int with array fill"
 * @return {*} a tab filled with ONE strong random number, ONE MILLION TIME
 */
function b_arr_int_fill() {
  const tab = new Int32Array(Number.ONE_MILLION);
  const strongRng = new Int32Array(1);
  window.crypto.getRandomValues(strongRng);
  tab.fill(strongRng[0]);
  return tab;
}
/**
 * "Creating array of 1 000 000 identical int with a for loop"
 * @return {*} a tab filled with ONE MILLION strong random number, ONE MILLION TIME
 */
function b_arr_int_for() {
  const tab = new Int32Array(Number.ONE_MILLION);
  for (let index = 0; index < Number.ONE_MILLION; index++) {
    const strongRng = new Int32Array(1);
    window.crypto.getRandomValues(strongRng);
    tab[index] = strongRng[0];
  }
  return tab;
}
/**
 * Creating array of 100 000 random strings that are 14 chars long
 * @return {*} a tab filled with 100 000 random strings that are 14 chars long
 */
function b_arr_str_low() {
  const tab = [];
  for (let index = 0; index < Number.ONE_HUNDRED_THOUSAND; index++) {
    tab[index] = randomString(Number.RANDOM_STRING_LENGTH);
  }
  return tab;
}
/**
 * Creating array of 1 000 000 random strings that are 14 chars long
 * @return {*} a tab filled with 1 000 000 random strings that are 14 chars long
 */
function b_arr_str_high() {
  const tab = [];
  for (let index = 0; index < Number.ONE_MILLION; index++) {
    tab[index] = randomString(Number.RANDOM_STRING_LENGTH);
  }
  return tab;
}

/**
 * @param {*} functionToBench list of string that contains id of the function to bench
 * @return {*} bench info, id, time, size, description
 */
export function bench(functionToBench) {
  const memoryBefore = performance.memory.usedJSHeapSize;
  const timeBefore = performance.now();
  let memoryUsed;
  // BENCH HERE
  switch (functionToBench) {
    case "b_arr_str_low":
      const bench_b_arr_str_low = b_arr_str_low();
      memoryUsed = performance.memory.usedJSHeapSize - memoryBefore;
      break;
    case "b_arr_str_high":
      const bench_b_arr_str_high = b_arr_str_high();
      memoryUsed = performance.memory.usedJSHeapSize - memoryBefore;
      break;
    case "b_arr_int_for":
      const bench_b_arr_int_for = b_arr_int_for();
      memoryUsed = performance.memory.usedJSHeapSize - memoryBefore;
      break;
    case "b_arr_int_fill":
      const bench_b_arr_int_fill = b_arr_int_fill();
      memoryUsed = performance.memory.usedJSHeapSize - memoryBefore;
      break;

    default:
      break;
  }
  //
  const timeEllapsed = performance.now() - timeBefore;
  return {
    description: Description[functionToBench],
    time: Math.round(timeEllapsed * 1000000),
    size: memoryUsed,
    id: functionToBench,
  };
}
/**
 * @return {*} platform information, creation date and units used
 */
export function benchInfo() {
  const time = new Date().toISOString();
  const platform = {
    type: "JS on " + navigator.appCodeName,
    OS: navigator.platform,
    uname: navigator.userAgent,
    version: navigator.appVersion,
  };
  const unit = {
    size: "octet",
    time: "nanosecond",
  };
  return {
    time: time,
    platform: platform,
    unit: unit,
    bench: [],
  };
}
