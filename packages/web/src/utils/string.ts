export function slugify(s:string) {
  return s.toLowerCase().replaceAll(/\W/g, "");
}
