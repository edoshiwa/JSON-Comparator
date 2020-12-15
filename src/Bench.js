/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

import Person from "./Person";

/**
 * Constant to improve readability
 */
const CustomNumber = {
  ONE_MILLION: 1000000,
  ONE_HUNDRED_THOUSAND: 100000,
  FIVE_HUNDRED_THOUSAND: 500000,
  RANDOM_STRING_LENGTH: 14,
  GRAPH_PERCENTAGE_STEP: 1,
};
/**
 * All available bench and their description
 * If you add a bench, don't forget to add a
 * description there.
 */
export const Description = {
  b_arr_str_low:
    "Creating array of 100 000 random strings that are 14 chars long",
  b_arr_str_high:
    "Creating array of 1 000 000 random strings that are 14 chars long",
  b_arr_int_for: "Creating array of 1 000 000 random int with a for loop",
  b_arr_int_fill: "Creating array of 1 000 000 identical int with array fill",
  b_asso_array:
    "Creating associative array of 500 000 int with key strings that are 14 chars long",

  b_obj:
    "Creating 100 000 objects with 7 properties (3 Strings that are 14 chars long and int) and dynamically add one string property to each that are 14 chars long",
  b_search_dict:
    "Creating associative array of 500 000 int with key strings that are 14 chars long and searching each one and sending back an array of every value",
};
/**
 * If the performance.memory API is available
 * it  will return the current heap memory used by
 * JS. Else it return NaN.
 * @return {Number} memory in Octet
 */
function currentMemory() {
  if ("memory" in performance) {
    return performance.memory.usedJSHeapSize;
  } else return NaN;
}
/**
 * Analyze an array of registered memory and return the
 * Adjusted Cumulative memory.
 * If tab[a+1]<tab[a] it won't add to the total
 * If there is x point like tab[a+1]<tab[a] we adjust the
 * final result like this :
 * adjusted memory = total memory + ((total memory)/(total point - x))*x
 * @param {Int16Array} data Array of Integer reprensenting memory.
 * @return {Number} adjusted memory
 */
function memoryAnalyzer(data) {
  let previousMemory = data[0].usedJSHeapSize;
  let currentMemory;
  let totalMemory = 0;
  let numberOfGarbageCollection = 0;
  for (let i = 1; i < data.length; i++) {
    currentMemory = data[i].usedJSHeapSize;
    if (currentMemory >= previousMemory)
      totalMemory += currentMemory - previousMemory;
    else numberOfGarbageCollection++;
    previousMemory = currentMemory;
  }
  const meanMemoryByStep =
    totalMemory / (data.length - numberOfGarbageCollection);
  const adujestedTotalMemory =
    totalMemory + meanMemoryByStep * numberOfGarbageCollection;
  return adujestedTotalMemory;
}
/**
 * Generate a random string
 * @param {Number} length of the wanted random string
 * @return {String} random string from alplanumeric chars of length char
 */
export function randomString(length) {
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
 * @return {Array} time taken to execute the benchmark and positive cumulative
 * used by the bench
 */
function b_arr_int_fill() {
  const timeBefore = performance.now();
  const memoryBefore = currentMemory();
  const memorySave = [];
  const tab = new Int32Array(CustomNumber.ONE_MILLION);
  const strongRng = new Int32Array(1);
  window.crypto.getRandomValues(strongRng);
  tab.fill(strongRng[0]);
  for (
    let index = 0;
    index < Math.floor(100 / CustomNumber.GRAPH_PERCENTAGE_STEP);
    index++
  ) {
    memorySave.push({
      name: index,
      usedJSHeapSize: currentMemory() - memoryBefore,
    });
  }
  return [performance.now() - timeBefore, memorySave];
}
/**
 * "Creating array of 1 000 000 identical int with a for loop"
 * @return {Array} time taken to execute the benchmark and positive cumulative
 * used by the bench
 */
function b_arr_int_for() {
  const timeBefore = performance.now();
  const memorySave = [];
  const tab = new Int32Array(CustomNumber.ONE_MILLION);
  for (let index = 0; index < CustomNumber.ONE_MILLION; index++) {
    if ((index / CustomNumber.ONE_MILLION) * 100 >= memorySave.length)
      memorySave.push({
        name: index,
        usedJSHeapSize: currentMemory(),
      });
    const strongRng = new Int32Array(1);
    window.crypto.getRandomValues(strongRng);
    tab[index] = strongRng[0];
  }
  return [performance.now() - timeBefore, memorySave];
}
/**
 * Creating array of 100 000 random strings that are 14 chars long
 * @return {Array} time taken to execute the benchmark and positive cumulative
 * used by the bench
 */
function b_arr_str_low() {
  const timeBefore = performance.now();
  const memorySave = [];
  const tab = [];
  for (let index = 0; index < CustomNumber.ONE_HUNDRED_THOUSAND; index++) {
    if ((index / CustomNumber.ONE_HUNDRED_THOUSAND) * 100 >= memorySave.length)
      memorySave.push({
        name: index,
        usedJSHeapSize: currentMemory(),
      });
    tab[index] = randomString(CustomNumber.RANDOM_STRING_LENGTH);
  }
  return [performance.now() - timeBefore, memorySave];
}
/**
 * Creating array of 1 000 000 random strings that are 14 chars long
 * @return {Array} time taken to execute the benchmark and positive cumulative
 * used by the bench
 */
function b_arr_str_high() {
  const timeBefore = performance.now();
  const memorySave = [];
  const tab = [];
  for (let index = 0; index < CustomNumber.ONE_MILLION; index++) {
    if ((index / CustomNumber.ONE_MILLION) * 100 >= memorySave.length)
      memorySave.push({
        name: index,
        usedJSHeapSize: currentMemory(),
      });
    tab[index] = randomString(CustomNumber.RANDOM_STRING_LENGTH);
  }
  return [performance.now() - timeBefore, memorySave];
}
/**
 * Creating 100 000 objects with 7 properties (3 Strings that are 14 chars long and int) and dynamically add one string property to each that are 14 chars long
 * @return {Array} time taken to execute the benchmark and positive cumulative
 * used by the bench
 */
function b_obj() {
  const timeBefore = performance.now();
  const memorySave = [];
  const tab = [];
  for (let index = 0; index < CustomNumber.FIVE_HUNDRED_THOUSAND; index++) {
    if ((index / CustomNumber.ONE_MILLION) * 100 >= memorySave.length)
      memorySave.push({
        name: index,
        usedJSHeapSize: currentMemory(),
      });
    tab[index] = new Person();
    tab[index].addString(randomString(14));
  }
  return [performance.now() - timeBefore, memorySave];
}
/**
 * Creating associative array of 500 000 int with key strings that are 14 chars long
 * @return {Array} time taken to execute the benchmark and positive cumulative
 * used by the bench
 */
function b_asso_array() {
  const timeBefore = performance.now();
  const memorySave = [];
  const tab = [];
  for (let index = 0; index < CustomNumber.FIVE_HUNDRED_THOUSAND; index++) {
    if ((index / CustomNumber.ONE_MILLION) * 100 >= memorySave.length)
      memorySave.push({
        name: index,
        usedJSHeapSize: currentMemory(),
      });
    tab[randomString(14)] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }
  return [performance.now() - timeBefore, memorySave];
}
/**
 * Creating associative array of 500 000 int with key strings that are 14 chars long and searching each one and sending back an array of every value
 * @return {Array} time taken to execute the benchmark and positive cumulative
 * used by the bench
 */
function b_search_dict() {
  const memorySave = [];
  const tab = [];
  const allKey = [];
  for (let index = 0; index < CustomNumber.FIVE_HUNDRED_THOUSAND; index++) {
    if ((index / CustomNumber.FIVE_HUNDRED_THOUSAND) * 50 >= memorySave.length)
      memorySave.push({
        name: index,
        usedJSHeapSize: currentMemory(),
      });
    allKey[index] = randomString(14);
    tab[allKey[index]] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }
  const timeBefore = performance.now();
  for (let index = 0; index < allKey.length; index++) {
    if ((index / CustomNumber.FIVE_HUNDRED_THOUSAND) * 50 >= memorySave.length)
      memorySave.push({
        name: index + CustomNumber.FIVE_HUNDRED_THOUSAND,
        usedJSHeapSize: currentMemory(),
      });
    const element = tab[allKey[index]];
  }
  return [performance.now() - timeBefore, memorySave];
}

/**
 * Execute a wanted bench if it exists
 * @param {String} functionToBench string that contains id of the function to bench
 * @return {Object} {description, time, size, id} of the bench result
 */
export function bench(functionToBench) {
  let memoryUsed;
  let timeEllapsed;
  let data;
  // BENCH HERE
  switch (functionToBench) {
    case "b_arr_str_low":
      [timeEllapsed, data] = b_arr_str_low();
      memoryUsed = memoryAnalyzer(data);
      break;
    case "b_arr_str_high":
      [timeEllapsed, data] = b_arr_str_high();
      memoryUsed = memoryAnalyzer(data);
      break;
    case "b_arr_int_for":
      [timeEllapsed, data] = b_arr_int_for();
      memoryUsed = memoryAnalyzer(data);
      break;
    case "b_arr_int_fill":
      [timeEllapsed, data] = b_arr_int_fill();
      memoryUsed = memoryAnalyzer(data);
      break;
    case "b_asso_array":
      [timeEllapsed, data] = b_asso_array();
      memoryUsed = memoryAnalyzer(data);
      break;
    case "b_obj":
      [timeEllapsed, data] = b_obj();
      memoryUsed = memoryAnalyzer(data);
      break;
    case "b_search_dict":
      [timeEllapsed, data] = b_search_dict();
      memoryUsed = memoryAnalyzer(data);
      break;

    default:
      return {
        error: "function doesn't exist",
      };
      break;
  }
  //
  return {
    description: Description[functionToBench],
    time: Math.round(timeEllapsed * 1000000),
    size: memoryUsed,
    id: functionToBench,
    data: data,
  };
}
/**
 * Give machine information by the time of the benchmark
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
