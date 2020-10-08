export function format_time(integer) {
  if (integer / 1000000000 > 1) {
    return Math.round(integer / 1000000000.0).toString() + " s";
  } else if (integer / 1000000 > 1) {
    return Math.round(integer / 1000000.0).toString() + " ms";
  } else if (integer / 1000 > 1) {
    return Math.round(integer / 1000.0).toString() + " µs";
  }
  return integer.toString() + " ns";
}

export function format_space(integer) {
  let prefix = [
    " o",
    " Kio",
    " Mio",
    " Gio",
    " Tio",
    " Pio",
    " Eio",
    " Zio",
    " Yio",
  ];
  let exp = 0;
  while (integer / Math.pow(1024, exp + 1) > 1) {
    exp++;
  }
  return Math.round(integer / Math.pow(1024, exp)).toString() + prefix[exp];
}
