export function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function addCommaToNumber(number) {
  const str = number.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

export function rgbaToString(rgba) {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}
export function str2bool(value) {
  if (value && typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return value;
}

export const linestyles = [
  "solid",
  "dot",
  "dash",
  "longdash",
  "dashdot",
  "longdashdot"
];

export const colorscales = [
  "Blackbody",
  "Bluered",
  "Blues",
  "Cividis",
  "Earth",
  "Electric",
  "Greens",
  "Greys",
  "Hot",
  "Jet",
  "Picnic",
  "Portland",
  "Rainbow",
  "RdBu",
  "Reds",
  "Viridis",
  "YlGnBu",
  "YlOrRd"
];