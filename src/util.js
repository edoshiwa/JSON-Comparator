/**
 * Convert a time value to a choosen SI units
 * @param {*} integer time value
 * @param {*} symbol unit name of the value
 * @param {*} targetSymbol unit name of the target unit
 */
export function format_time(
  integer,
  symbol = "nanosecond",
  targetSymbol = "microsecond"
) {
  let siNames = ["nanosecond", "microsecond", "millisecond", "second"];
  let siSymbols = ["ns", "µs", "ms", "s"];
  let expos = [-24, -21, -18, -15, -12, -9, -6, -3, 0];

  let index = siNames.indexOf(symbol);
  let baseIndexExp = index === -1 ? siNames.indexOf("nanosecond") : index;
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
    let targetIndex = siNames.indexOf(targetSymbol);
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
 */
export function adapted_time_symbol(integer, symbol = "nanosecond") {
  let siNames = ["nanosecond", "microsecond", "millisecond", "second"];
  let expos = [-24, -21, -18, -15, -12, -9, -6, -3, 0];

  let index = siNames.indexOf(symbol);
  let baseIndexExp = index === -1 ? siNames.indexOf("nanosecond") : index;
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
 */
export function format_space(integer, symbol = "octet", targetSymbol = null) {
  let siNames = ["octet", "kibioctet", "mebioctet", "gibioctet", "tebioctet"];
  let siSymbols = ["o", "Kio", "Mio", "Gio", "Tio"];
  let baseExp = siNames.indexOf(symbol) === -1 ? 0 : siNames.indexOf(symbol);
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
 */
export function adapted_space_symbol(integer, symbol = "octet") {
  let siNames = ["octet", "kibioctet", "mebioctet", "gibioctet", "tebioctet"];
  let baseExp = siNames.indexOf(symbol) === -1 ? 0 : siNames.indexOf(symbol);
  let exp;

  exp = siNames.indexOf(symbol);
  while (integer / Math.pow(1024, exp + 1 - baseExp) > 1) {
    exp++;
  }

  return siNames[exp];
}
