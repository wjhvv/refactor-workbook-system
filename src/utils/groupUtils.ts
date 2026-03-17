export function getMaxGroupNumber(rowGroupMap: Record<number, number>): number {
  return Object.values(rowGroupMap).reduce((m, v) => (v > m ? v : m), 0);
}
