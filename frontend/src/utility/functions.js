export function get_pathname() {
  let pathname = window.location.pathname;
  pathname = pathname.split("/");
  return pathname[1];
}

export function displayDate(date) {
  let d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
