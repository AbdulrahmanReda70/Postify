export function get_pathname() {
  let pathname = window.location.pathname;
  pathname = pathname.split("/");
  return pathname[1];
}

export function displayDate(date) {
  let d = new Date("2025-02-12T20:12:27.000000Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
