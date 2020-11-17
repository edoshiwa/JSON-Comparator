/**
 * Convert a time value to a choosen SI units
 * @param {*} integer time value
 * @param {*} symbol unit name of the value
 * @param {*} targetSymbol unit name of the target unit
 * @return {*} a string of time value converted to target symbol with the target symbol added
 */
export function formatTime(
  integer,
  symbol = "nanosecond",
  targetSymbol = "microsecond"
) {
  const siNames = ["nanosecond", "microsecond", "millisecond", "second"];
  const siSymbols = ["ns", "µs", "ms", "s"];
  const expos = [-24, -21, -18, -15, -12, -9, -6, -3, 0];

  const index = siNames.indexOf(symbol);
  const baseIndexExp = index === -1 ? siNames.indexOf("nanosecond") : index;
  let expIndex;
  if (targetSymbol == null) {
    expIndex = baseIndexExp;
    while (
      expIndex + 1 <= expos.length &&
      integer / Math.pow(10, expos[expIndex + 1] - expos[baseIndexExp]) > 1
    ) {
      expIndex++;
    }
  } else {
    const targetIndex = siNames.indexOf(targetSymbol);
    expIndex =
      targetSymbol === -1 ? siNames.indexOf("nanosecond") : targetIndex;
  }
  return (
    Math.round(
      integer / Math.pow(10, expos[expIndex] - expos[baseIndexExp])
    ).toString() +
    " " +
    siSymbols[expIndex]
  );
}
/**
 * Find the most appropriated symbol for a given time value (with less digit)
 * @param {*} integer time value
 * @param {*} symbol unit name
 * @return {*} the smallest unit for the time value to be still readable
 */
export function adaptedTimeSymbol(integer, symbol = "nanosecond") {
  const siNames = ["nanosecond", "microsecond", "millisecond", "second"];
  const expos = [-24, -21, -18, -15, -12, -9, -6, -3, 0];

  const index = siNames.indexOf(symbol);
  const baseIndexExp = index === -1 ? siNames.indexOf("nanosecond") : index;
  let expIndex = baseIndexExp;
  while (
    expIndex + 1 <= expos.length &&
    integer / Math.pow(10, expos[expIndex + 1] - expos[baseIndexExp]) > 1
  ) {
    expIndex++;
  }
  return siNames[expIndex];
}
/**
 * Convert a size value to a choosen SI units
 * @param {*} integer size value
 * @param {*} symbol unit name of the value
 * @param {*} targetSymbol unit name of the target unit
 * @return {*} a string of size value converted to target symbol with the target symbol added
 */
export function formatSize(integer, symbol = "octet", targetSymbol = null) {
  const siNames = ["octet", "kibioctet", "mebioctet", "gibioctet", "tebioctet"];
  const siSymbols = ["o", "Kio", "Mio", "Gio", "Tio"];
  const baseExp = siNames.indexOf(symbol) === -1 ? 0 : siNames.indexOf(symbol);
  let exp;
  if (targetSymbol == null) {
    exp = siNames.indexOf(symbol);
    while (integer / Math.pow(1024, exp + 1 - baseExp) > 1) {
      exp++;
    }
  } else {
    exp = siNames.indexOf(targetSymbol);
  }
  return (
    Math.round(integer / Math.pow(1024, exp - baseExp)).toString() +
    " " +
    siSymbols[exp]
  );
}
/**
 * Find the most appropriated symbol for a given size value (with less digit)
 * @param {*} integer size value
 * @param {*} symbol unit name
 * @return {*} the smallest unit for the size value to be still readable
 */
export function adaptedSizeSymbol(integer, symbol = "octet") {
  const siNames = ["octet", "kibioctet", "mebioctet", "gibioctet", "tebioctet"];
  const baseExp = siNames.indexOf(symbol) === -1 ? 0 : siNames.indexOf(symbol);
  let exp;

  exp = siNames.indexOf(symbol);
  while (integer / Math.pow(1024, exp + 1 - baseExp) > 1) {
    exp++;
  }

  return siNames[exp];
}
