/** Splits items sequentially into `count` columns — column 1 gets the first
 * chunk, column 2 the next, and so on — for rendering as independent flex
 * columns instead of CSS multi-column (Safari doesn't balance columns in an
 * auto-height container, so the last item can land on the wrong column). */
export function splitIntoColumns<T>(items: T[], count = 2): T[][] {
  const size = Math.ceil(items.length / count);
  return Array.from({ length: count }, (_, i) => items.slice(i * size, (i + 1) * size));
}
